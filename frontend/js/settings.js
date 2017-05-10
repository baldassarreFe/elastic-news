export let settings = {
    searchResults: 50,
    recommendations: 5,
    verbose: true,
    shouldUseHistory: false
};

// Elasticsearch urls to try:
export let elasticsearchUrls = ['http://localhost:9200'];
if (window.location.hostname)
    elasticsearchUrls.push('http://' + window.location.hostname + ':9200');
