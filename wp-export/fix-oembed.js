import fs from 'fs';

// 1. Load your converted JSON file
const rawData = fs.readFileSync('output.json', 'utf8');
const data = JSON.parse(rawData);

const posts = data.channel?.item || []; 
const embedMap = {};

// 2. Map all metadata embeds to a lookup dictionary
posts.forEach(post => {
  let metaArray = post["wp:postmeta"];
  if (!metaArray) return;

  // If it's a single object instead of an array, wrap it in an array
  if (!Array.isArray(metaArray)) {
    metaArray = [metaArray];
  }

  metaArray.forEach(meta => {
    const key = meta["wp:meta_key"];
    const value = meta["wp:meta_value"];

    if (key && key.startsWith('_oembed_') && !key.startsWith('_oembed_time_') && value) {
      const srcMatch = value.match(/src="([^"]+)"/);
      if (srcMatch) {
        const fullSrc = srcMatch[1];

        // --- YouTube Strategy ---
        if (fullSrc.includes('youtube.com/embed/')) {
          const ytIdMatch = fullSrc.match(/embed\/([a-zA-Z0-9_-]{11})/);
          if (ytIdMatch) {
            embedMap[`YOUTUBE_${ytIdMatch[1]}`] = value;
          }
        } 
        // --- Standard Link/Mastodon Strategy ---
        else {
          let embedUrl = fullSrc.split('/embed')[0]; 
          embedMap[embedUrl] = value;
          embedMap[embedUrl.replace('https://', 'http://')] = value;
        }
      }
    }
  });
});

// 3. Loop through posts and swap placeholders with iframes
posts.forEach(post => {
  let content = post["content:encoded"] || post["content"];
  if (!content) return;

  Object.keys(embedMap).forEach(key => {
    const iframeHtml = embedMap[key];

    if (key.startsWith('YOUTUBE_')) {
      const ytId = key.replace('YOUTUBE_', '');
      
      const ytRegex = new RegExp(
        `<div class="wp-block-embed__wrapper">[\\s\\n]*(https?:\\/\\/(?:www\\.)?(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)${ytId}\\S*)[\\s\\n]*<\\/div>`, 
        'gi'
      );
      
      content = content.replace(ytRegex, `<div class="wp-block-embed__wrapper">\n${iframeHtml}\n</div>`);

    } else {
      // Standard Link replacement
      const linkRegex = new RegExp(`<p><a[^>]*href="${key}"[^>]*>.*?</a></p>`, 'g');
      content = content.replace(linkRegex, iframeHtml);
    }
  });

  if (post["content:encoded"]) post["content:encoded"] = content;
  if (post["content"]) post["content"] = content;
});

// 4. Output the updated array
fs.writeFileSync('export_fixed.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`Finished processing ${posts.length} items! Saved to export_fixed.json`);