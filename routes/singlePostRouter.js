import { Router } from 'express'
import fs from 'fs';
import footer from './footer.js';
import {jsonData} from './postData.js';

const router = Router({ mergeParams: true })

const mapItems = async (items) => {

    const post = items
        .map(post => ({

        }))
    return postsArray;
}

const singlePost = async (slug) => {
    try {
        const posts = await jsonData();
        const postIndex = posts.findIndex((item) => item['wp:post_name'] === slug);

        const post = posts[postIndex];
        const previousPost = posts[postIndex - 1]; // Left neighbor
        const nextPost = posts[postIndex + 1]; // Right neighbor

        const postData = {
            title: post.title,
            post_date: post['wp:post_date'],
            author: post['dc:creator'],
            post_id: post['wp:post_id'],
            post_name: post['wp:post_name'],
            link: post.link,
            content: post['content:encoded'] || '',
            previousPost: previousPost ? {
                title: previousPost.title,
                post_name: previousPost['wp:post_name']
            } : null,
            nextPost: nextPost ? {
                title: nextPost.title,
                post_name: nextPost['wp:post_name']
            } : null
        }
        return postData; // Return the single post object or null if not found
    }
    catch (error) {
        console.error("Failed to process single post data:", error);
        // Return a safe fallback structure so the calling code doesn't crash
        return { title: 'Error', content: 'Failed to load', author: 'Unknown', post_date: 'Unknown' };
    }
}
/*single post route*/
router.get('/', async (req, res, next) => {
    const postData = await singlePost(req.params.slug);
    const footerData = await footer();
    if (!postData) {
        next(); // Pass control to the next middleware (which should be the 404 handler)
        return; // Ensure we don't continue to render if postData is null
    }
    res.render('post', { title: "Johannes Kalma", post: postData, footer: footerData });
});

export default router;