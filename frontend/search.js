var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

module.exports = {
    simpleSearch: function(user_query) {
        console.log('simple search')
    },
    feedbackSearch: function(user_query, relevantDocuments) {
        console.log('relevance search')
    }
}