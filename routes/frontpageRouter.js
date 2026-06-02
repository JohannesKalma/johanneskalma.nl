import { Router } from 'express'
const router = Router()
import footer from './footer.js';
import {jsonData} from './postData.js';

const mapItems = async (items, page) => {
    const postsPerPage = 10;
    const sliceStart = (page - 1) * postsPerPage;
    const sliceEnd = sliceStart + postsPerPage;
    console.log(`Mapping items from index ${sliceStart} to ${sliceEnd}`);
    // 3. Filter and Map in a single pipeline (Replaces the heavy .reduce())
    const postsArray = items
        .map(post => ({
            title: post.title,
            post_date: post['wp:post_date'],
            author: post['dc:creator'],
            post_id: post['wp:post_id'],
            post_name: post['wp:post_name'],
            link: post.link,
            content: post['content:encoded'] || '',
        }))
        .sort((b, a) => a.post_date.localeCompare(b.post_date))
        .slice(sliceStart, sliceEnd); // Limit to specified range for front page
    return postsArray;
}

const frontpageData = async (sliceStart, sliceEnd) => {
    try {
        const items = await jsonData();
        const mappedItems = await mapItems(items, sliceStart, sliceEnd);
        return mappedItems || []; // Ensure we return an array even if mapping fails
    } catch (error) {
        console.error("Failed to process frontpage items:", error);
        // Return a safe fallback structure so the calling code doesn't crash
        return { title: 'Error', description: 'Failed to load', postData: [] };
    }
};

async function Pagination(pageParam) {
    const limit = 10;
    const data= await jsonData();
    const totalPosts = data.length;
    console.log(`Total posts available: ${totalPosts}`); // Log total posts for debugging
    const totalPages = Math.ceil(totalPosts / limit);
    
    let currentPage = parseInt(pageParam) || 1;
    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    //const paginatedPosts = allPosts.slice(startIndex, endIndex);

    // ---- HIER BEREKENEN WE DE LINKS VOORAF ----
    let prevPageUrl = null;
    let nextPageUrl = null;

    // Vorige link bepalen
    if (currentPage > 1) {
        prevPageUrl = (currentPage === 2) ? '/' : `/page/${currentPage - 1}`;
    }

    // Volgende link bepalen
    if (currentPage < totalPages) {
        nextPageUrl = `/page/${currentPage + 1}`;
    }

    return {
        currentPage: currentPage,
        totalPages: totalPages,
        prevPageUrl: prevPageUrl,
        nextPageUrl: nextPageUrl
    };
}

/*frontpage route*/
router.get('/', async (req, res) => {
    const postData = await frontpageData(1);
    const paginationData = await Pagination(1);
    const footerData = await footer();
    console.log("Footer data for front page:", footerData); // Debug log to verify footer data structure
    res.render('index', {
        title: "Johannes Kalma", 
        posts: postData, 
        pagination: paginationData,
        footer: footerData
    });
});

/*pagination route with page parameter /page/:page*/
router.get('/:page', async (req, res) => {
    const page = parseInt(req.params.page, 10);
    const paginationData = await Pagination(page);
    const postData = await frontpageData(page);
    const footerData = await footer();

    if (!postData || postData.length === 0) {
        return res.status(404).render('404', { url: req.originalUrl, message: `No posts found for page ${page}.` });
    }

    res.render('index', {
        title: "Johannes Kalma", 
        posts: postData, 
        pagination: paginationData,
        footer: footerData
    });
});

export default router;