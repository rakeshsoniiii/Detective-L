// Live Multi-Engine Search Service for Detective-L
// Executes authentic programmatic searches across Reddit, Wikipedia, DuckDuckGo, and Public Web

/**
 * Searches Reddit for public posts, discussions, and theories with robust CORS fallbacks
 */
export async function searchLiveReddit(query, limit = 6) {
  const cleanQuery = encodeURIComponent(query.trim());
  const redditUrl = `https://www.reddit.com/search.json?q=${cleanQuery}&limit=${limit}&sort=relevance`;

  // Attempt 1: Direct fetch
  try {
    const res = await fetch(redditUrl, { headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      const posts = data?.data?.children || [];
      if (posts.length > 0) {
        return posts.map(item => {
          const p = item.data;
          return {
            id: `reddit_${p.id}`,
            source: 'Reddit',
            title: p.title,
            url: `https://www.reddit.com${p.permalink}`,
            snippet: p.selftext ? p.selftext.slice(0, 300) + '...' : `Posted in r/${p.subreddit} by u/${p.author}`,
            author: p.author,
            subreddit: `r/${p.subreddit}`,
            upvotes: p.score,
            numComments: p.num_comments,
            createdAt: p.created_utc ? new Date(p.created_utc * 1000).toLocaleDateString() : null
          };
        });
      }
    }
  } catch (e) {
    // Fall through to proxy attempt
  }

  // Attempt 2: AllOrigins CORS proxy
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(redditUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const proxyData = await res.json();
      const parsed = JSON.parse(proxyData.contents);
      const posts = parsed?.data?.children || [];
      if (posts.length > 0) {
        return posts.map(item => {
          const p = item.data;
          return {
            id: `reddit_${p.id}`,
            source: 'Reddit',
            title: p.title,
            url: `https://www.reddit.com${p.permalink}`,
            snippet: p.selftext ? p.selftext.slice(0, 300) + '...' : `Posted in r/${p.subreddit} by u/${p.author}`,
            author: p.author,
            subreddit: `r/${p.subreddit}`,
            upvotes: p.score,
            numComments: p.num_comments,
            createdAt: p.created_utc ? new Date(p.created_utc * 1000).toLocaleDateString() : null
          };
        });
      }
    }
  } catch (e) {
    // Fall through
  }

  return [];
}

/**
 * Searches Wikipedia for factual and historical background
 */
export async function searchLiveWikipedia(query, limit = 4) {
  try {
    const cleanQuery = encodeURIComponent(query.trim());
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${cleanQuery}&utf8=&format=json&origin=*&srlimit=${limit}`
    );

    if (!res.ok) return [];

    const data = await res.json();
    const searchResults = data?.query?.search || [];

    return searchResults.map(item => {
      const cleanSnippet = (item.snippet || '').replace(/<\/?[^>]+(>|$)/g, '');
      return {
        id: `wiki_${item.pageid}`,
        source: 'Wikipedia',
        title: item.title,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
        snippet: cleanSnippet,
        wordCount: item.wordcount,
        timestamp: item.timestamp ? new Date(item.timestamp).toLocaleDateString() : null
      };
    });
  } catch (error) {
    console.error('Wikipedia search error:', error);
    return [];
  }
}

/**
 * Searches DuckDuckGo for instant answers and topic abstracts
 */
export async function searchLiveDuckDuckGo(query) {
  try {
    const cleanQuery = encodeURIComponent(query.trim());
    const res = await fetch(`https://api.duckduckgo.com/?q=${cleanQuery}&format=json&no_html=1&skip_disambig=1`);

    if (!res.ok) return [];

    const data = await res.json();
    const results = [];

    if (data.AbstractText) {
      results.push({
        id: 'ddg_abstract',
        source: 'DuckDuckGo',
        title: data.Heading || query,
        url: data.AbstractURL || `https://duckduckgo.com/?q=${cleanQuery}`,
        snippet: data.AbstractText,
        sourceName: data.AbstractSource
      });
    }

    if (Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.slice(0, 3).forEach((topic, idx) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            id: `ddg_related_${idx}`,
            source: 'DuckDuckGo',
            title: topic.Text.split(' - ')[0] || 'Related Topic',
            url: topic.FirstURL,
            snippet: topic.Text
          });
        }
      });
    }

    return results;
  } catch (error) {
    return [];
  }
}

/**
 * Combined Multi-Engine Live Search
 * Queries Reddit, Wikipedia, and DuckDuckGo in parallel and aggregates real forensic sources
 */
export async function deepForensicWebSearch(query) {
  const startTime = performance.now();
  
  const [redditResults, wikiResults, ddgResults] = await Promise.all([
    searchLiveReddit(query, 5),
    searchLiveWikipedia(query, 4),
    searchLiveDuckDuckGo(query)
  ]);

  const allResults = [...redditResults, ...wikiResults, ...ddgResults];
  const elapsedSec = ((performance.now() - startTime) / 1000).toFixed(2);

  return {
    query,
    totalFound: allResults.length,
    elapsedSec,
    results: allResults,
    redditCount: redditResults.length,
    wikiCount: wikiResults.length,
    ddgCount: ddgResults.length
  };
}
