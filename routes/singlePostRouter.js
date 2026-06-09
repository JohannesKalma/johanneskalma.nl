import { Router } from 'express'
import footer from './footer.js';
import { jsonData } from './postData.js';

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

        console.log(`Looking for post with slug: ${slug}. Found at index: ${postIndex}`); // Debug log to verify slug and index

        if (!postIndex || postIndex === '' || postIndex < 0) {
            return null; // Return null if post not found, which will trigger 404 in route handler
        }

        const post = posts[postIndex];
        const previousPost = posts[postIndex - 1]; // Left neighbor
        const nextPost = posts[postIndex + 1]; // Right neighbor

        console.log(post); // Debug log to verify post data

        const postCategory = Array.isArray(post.category) ? post.category : [post.category];

        const { categories, tags } = postCategory.reduce((acc, item) => {
            if (item['@_domain'] === 'category') acc.categories.push(item['#text']);
            if (item['@_domain'] === 'post_tag') acc.tags.push(item['#text']);
            return acc;
        }, { categories: [], tags: [] });

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
            } : null,
            taxonomy: {
                categories: categories.join(', '),
                tags: tags.join(', ')
            }
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
    if (!postData) {
        return next(); // Pass control to the next middleware (which should be the 404 handler)
    }
    res.render('post', { post: postData, footer: await footer() });
});

export default router;