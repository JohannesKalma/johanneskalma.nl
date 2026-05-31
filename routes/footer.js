import { promises as fs } from 'fs';
import path from 'path';
import { title } from 'process';

const dataFileBasePath = process.env.DATA_FILE_BASEPATH;
const dataFilePath = `${dataFileBasePath}post.json`;

const fileData = async () => {
  const fullPath = path.resolve(dataFilePath);
  const file = await fs.readFile(fullPath, 'utf-8');
  return file;
}

const jsonData = async () => {
  const rawData = await fileData();
  return JSON.parse(rawData);
}

const footerAggregated = async (postsData) => {
  // const postsData = await jsonDatax(); // Assuming this is your main posts data file
  const aggregatedData = await postsData.reduce(async (accPromise, post) => {
    const acc = await accPromise;
    // If a post has no categories/tags, skip it safely
    if (!post.category) return acc;

    const categoriesArray = Array.isArray(post.category) ? post.category : [post.category];

    await Promise.all(categoriesArray.map(async item => {
      const domain = item["@_domain"]; // 'category' or 'post_tag'

      // NEW SAFETY CHECK: If it's not a category or a post_tag, skip it entirely!
      if (domain !== 'category' && domain !== 'post_tag') {
        return; // Drops out of this specific forEach loop iteration
      }

      const text = item["#text"];
      const slug = item["@_nicename"];

      // Determine which group to put this in
      const group = domain === 'category' ? acc.categories : acc.tags;

      if (group[slug]) {
        // If we've seen this slug before, increment the count
        group[slug].count += 1;
      } else {
        // If it's new, create the initial object
        group[slug] = { text, slug, count: 1 };
      }
    }));

    return acc;
  }, { categories: {}, tags: {} }); // Initializing our accumulator with two empty lookup objects

  // Convert the lookup objects into arrays for easier use in templates
  const categoriesArray = Object.values(aggregatedData.categories);
  const tagsArray = Object.values(aggregatedData.tags);

  return { categories: categoriesArray, tags: tagsArray };
}

const footerData = async () => {
  // 1. Load your converted WordPress JSON files
  const postsData = await jsonData(dataFilePath); // Assuming this is your main posts data file
  const aggregatedData = await footerAggregated(postsData);
  const categoriesData = aggregatedData.categories;
  const tagsData = aggregatedData.tags;

  // 2. Extract recent posts (assuming array is ordered newest to oldest, get first 3)
  const recentPosts = postsData.map(post => ({
    title: post.title
    , slug: post['wp:post_name']
    , date: post['wp:post_date']
  })).sort((b, a) => new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  // 3. Extract topics/categories
  const categories = categoriesData;

  // 4. Extract tags for your tag cloud
  const tags = tagsData;

  // 5. Dynamic data (Lyrics & Radio Stations)
  const dynamicLyrics = "It doesn't matter if we all die... Ambition in the back of a black car"; // The Cure - One Hundred Years
  const favoriteRadios = [
    { name: 'KINK', url: 'https://kink.nl' },
    { name: 'Radio Veritas', url: '#' } // Add more favorites here
  ];

  return {
    recentPosts,
    categories,
    tags,
    dynamicLyrics,
    favoriteRadios
  };
}

export default footerData;