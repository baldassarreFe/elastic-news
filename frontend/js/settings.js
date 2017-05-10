export let settings = {
    maxResults: 10,
    verbose: true,
    shouldUseHistory: true
};

// Elasticsearch urls to try:
export let elasticsearchUrls = ['http://localhost:9200'];
if (window.location.hostname)
    elasticsearchUrls.push('http://' + window.location.hostname + ':9200');
