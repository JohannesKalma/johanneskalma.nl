import wp from './wp-export/wp-filters.js';

const channelData = await wp.filteredChannel();

console.log(JSON.stringify(channelData, null, 2)); // Log the filtered channel data

const posts = await wp.filteredPosts();
console.log(`Total posts with relevant meta: ${posts.length}`); // Log the count of filtered posts

//console.log(JSON.stringify(posts, null, 2)); // Log the filtered items

//const uniqueKeys = [...new Set(posts.flatMap(post => post.post_meta_keys || []))];

//console.log('Unique Meta Keys:', uniqueKeys);
