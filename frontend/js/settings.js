export let maxResults = 10;
export let verbose = true;

// Elasticsearch urls to try:
export let elasticsearchUrls = ['http://localhost:9200'];
if (window.location.hostname)
    elasticsearchUrls.push('http://' + window.location.hostname + ':9200');
