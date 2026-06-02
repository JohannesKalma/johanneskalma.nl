import { Router } from 'express'
import fs from 'fs';
import footer from './footer.js';
import { jsonData } from './postData.js';

const router = Router()

router.get('/', async (req, res, next) => {

    const pathSegments = req.baseUrl.split('/').filter(segment => segment); // Filter out empty segments
    const filterType = pathSegments[0]; // 'tag', 'topic', or 'category'
    const slug = pathSegments[1]; // The actual slug value

    const posts = await jsonData();

    const filteredPosts = posts.filter(post => {

        if (!post.category) return false; // If there are no categories/tags, skip this post

        const categories = Array.isArray(post.category) ? post.category : [post.category];

        if (filterType === 'tag') {
            return categories.some(cat => cat['@_domain'] === 'post_tag' && cat['@_nicename'] === slug);
        } else if (filterType === 'topic' || filterType === 'category') {
            return categories.some(cat => cat['@_domain'] === 'category' && cat['@_nicename'] === slug);
        }
        return false;

    }).map(post => ({
        title: post.title,
        post_date: post['wp:post_date'],
        author: post['dc:creator'],
        post_id: post['wp:post_id'],
        post_name: post['wp:post_name'],
        link: post.link,
        content: post['content:encoded'] || '',
    })).sort((b, a) => a.post_date.localeCompare(b.post_date))
       //.slice(0, 10); // Limit to specified range for front page
  
    res.render('taxonomy', {
        title: `Posts with ${filterType}: ${slug}`,
        posts: filteredPosts,
        footer: await footer()
    });
    //res.send(`Taxonomy route is working for ${filterType} with slug: ${slug}`);
})
export default router;

