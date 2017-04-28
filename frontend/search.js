var elasticsearch = require('elasticsearch');
var Promise = require('promise');

var client = new elasticsearch.Client({
    host: 'http://localhost:9200',
    log: 'trace'
});

function queryWithUserString(user_query) {
    return {
        index: 'news',
        type: 'article',
        body: {
            size: 10,
            query: {
                bool: {
                    should: [
                        {
                            match: {
                                fullText: user_query
                            }
                        }
                    ]
                }
            }
        }
    };
}

exports.simpleSearch = function (user_query, maxResults) {
    var searchParams = queryWithUserString(user_query);

    client.search(searchParams, function (err, res) {
        if (err) {
            throw err;
        }

        console.log(res.hits.hits);
    })
}

exports.feedbackSearch = function (user_query, relevantDocuments, maxResults) {
    var searchParams = queryWithUserString(user_query)

    var length = relevantDocuments.length;
    var length_key;
    var length_ent;
    var keywords = [];
    var entities = [];
    var keywords_temp = [];
    var entities_temp = [];
    for (var i = 0; i < length; i++) {
        keywords_temp = relevantDocuments[i].keywords;
        entities_temp = relevantDocuments[i].entities;
        length_key = keywords_temp.length;
        length_ent = entities_temp.length;

        for (var a = 0; a < length_key; a++) {
            if (!keywords.includes(keywords_temp[a])) {
                keywords.push(keywords_temp[a]);
            }
        }
        for (var b = 0; b < length_ent; b++) {
            if (!entities.includes(entities_temp[b])) {
                entities.push(entities_temp[b]);
            }
        }
    }

    length = keywords.length;
    for (var i = 0; i < length; i++) {
        searchParams.body.query.bool.should[0].match.fullText += (" " + keywords[i]);
    }

    client.search(searchParams, function (err, res) {
        if (err) {
            throw err;
        }

        console.log(res.hits.hits);
    })
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
