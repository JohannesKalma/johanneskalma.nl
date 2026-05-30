

/*
const filteredPosts = async () => {
    const items = await filteredItems('post');
    const filteredData = items?.map(post => ({
        title: post.title,
        tags: post.category ? (Array.isArray(post.category) ? post.category.map(cat => cat['$']?.nicename) : [post.category['$']?.nicename]) : [],
        //categories: post.category ? (Array.isArray(post.category) ? post.category.map(cat => cat['$'].domain === 'category' ? cat['$'].nicename : null).filter(Boolean) : [post.category['$'].domain === 'category' ? post.category['$'].nicename : null].filter(Boolean)) : [],
        //content: post['content:encoded'] || '',
        post_meta: (
            Array.isArray(post['wp:postmeta'])
                ? post['wp:postmeta']
                : post['wp:postmeta'] ? [post['wp:postmeta']] : []
        )
            .filter(meta => {
                const key = meta['wp:meta_key'] || '';
                const val = meta['wp:meta_value'] || meta['value'] || '';

                return (
                    // 1. Must contain '_oembed_'
                    key.includes('_oembed_') &&
                    // 2. Must NOT contain '_oembed_time_'
                    !key.includes('_oembed_time_') &&
                    // 3. Skip if the value is '{{unknown}}'
                    val !== '{{unknown}}'
                );
            })
            .map(meta => ({
                meta_key: meta['wp:meta_key'],
                meta_value: meta['wp:meta_value'] || meta['value']
            }))
    })).filter(post_meta => post_meta.post_meta.length > 0); // Only keep posts that have relevant meta
    return filteredData;
}
*/


/*
function wpAutop(text) {
    if (!text) return '';

    // 1. Clean up the trailing non-breaking space WordPress loves to leave behind
    let cleaned = text.replace(/&nbsp;\s*$/, '').trim();

    // 2. Temporarily protect block elements like <pre>...</pre> so regex doesn't touch them
    const blocks = [];
    cleaned = cleaned.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (match) => {
        blocks.push(match);
        return `___BLOCK_PLACEHOLDER_${blocks.length - 1}___`;
    });

    // 3. Split the remaining text into paragraphs using double newlines
    const paragraphs = cleaned.split(/\n{2,}/);

    // 4. Process each paragraph chunk
    let htmlParagraphs = paragraphs.map(para => {
        para = para.trim();
        if (!para) return '';

        // If it's just our placeholder block, return it raw without <p> tags
        if (para.startsWith('___BLOCK_PLACEHOLDER_')) {
            return para;
        }

        // Replace any remaining single newlines inside normal text with <br />
        para = para.replace(/\n/g, '<br />\n');

        return `<p>${para}</p>`;
    });

    // 5. Join paragraphs back together
    let finalHTML = htmlParagraphs.filter(Boolean).join('\n');

    // 6. Restore the original <pre> blocks back into their placeholders
    blocks.forEach((block, index) => {
        finalHTML = finalHTML.replace(`___BLOCK_PLACEHOLDER_${index}___`, block);
    });

    return finalHTML;
}


const wpFixedContent = (content) => {
    //if (typeof content !== 'string') return content; // Guard clause for non-string content

    // 1. Replace WordPress-specific shortcodes with placeholders
    let fixedContent = content.replace(/\[gallery.*?\]/g, '[Gallery Placeholder]');

    // 2. Convert WordPress line breaks to HTML line breaks
    //fixedContent = fixedContent.replace(/\r\n|\r|\n/g, '<br>');

    // 3. Handle any other common WordPress formatting quirks here...
    fixedContent = wpAutop(fixedContent); // Example: Convert double line breaks to paragraphs

    return fixedContent;
}
*/