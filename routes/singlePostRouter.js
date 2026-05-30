import { Router } from 'express'
import fs from 'fs';
const router = Router({ mergeParams: true })

const dataFileBasePath = '/home/jkalma/Git/johanneskalma.nl/wp-export/split_output/';
const dataFilePath = `${dataFileBasePath}post.json`;

const fileData = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile(dataFilePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const jsonData = async () => {
    return JSON.parse(await fileData());
}

const mapItems = async (items) => {
 
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
    return postsArray;
}

const singlePost = async (slug) => {
    try {
        const items = await jsonData();
        console.log(`Looking for post with slug: ${slug}`);
        console.log(`Total posts available: ${items.length}`);
        //console.log(items[1]); // Log the second item to check structure (adjust index as needed)
        let post = items.find(item => item['wp:post_name'] === slug);
        console.log('Found post:', post);
        if (!post) {
            //throw createError(404, `Post with slug ${slug} not found.`);
            return null; // Return null if not found, the calling code can handle this case
        }

        post = [post]; // Wrap in array to reuse mapItems logic for consistent structure
        console.log('Found post for slug:', slug);
        const mappedPost = await mapItems(post);
        console.log('Mapped post data:', mappedPost); 
        return mappedPost; // Return the single post object or null if not found
    }
    catch (error) {
        console.error("Failed to process single post data:", error);
        // Return a safe fallback structure so the calling code doesn't crash
        return { title: 'Error', content: 'Failed to load', author: 'Unknown', post_date: 'Unknown' };
    }
}

router.get('/', async (req, res, next) => {
    //try {
    const postSlug = req.params.slug;
        console.log('SLUG');
        const postData = await singlePost(req.params.slug);
         if (!postData) {
            next(); // Pass control to the next middleware (which should be the 404 handler)
            return; // Ensure we don't continue to render if postData is null
        }
        res.render('post', {title:"My Blog", posts: postData });
    //} catch (error) {
      //  next(error); // Pass the error to the global error handler
    //}
    })

export default router;