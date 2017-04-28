var elasticsearch = require('elasticsearch');
var Promise = require('promise');

var client = new elasticsearch.Client({
    host: 'http://localhost:9200',
    log: 'trace'
});
exports.simpleSearch = function (user_query, maxResults) {

}
exports.feedbackSearch = function (user_query, relevantDocuments, maxResults) {
    console.log('relevance search')
};

exports.connectionOk = function () {
    return client.ping({requestTimeout: 30000})
        .then(function () {
            return Promise.resolve(true)
        })
        .catch(function (error) {
            console.error(error);
            return Promise.resolve(false)
        });
};
