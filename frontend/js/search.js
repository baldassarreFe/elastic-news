const elasticsearch = require('elasticsearch');
const Promise = require('promise');

let client = new elasticsearch.Client({
    host: 'http://localhost:9200',
    log: ['error', 'warning']
});

function queryWithUserString(user_query, maxResults) {
    return {
        index: 'news',
        type: 'article',
        body: {
            size: maxResults,
            query: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query: user_query,
                                fields: ["fullText^1", "title^2"]
                            }
                        }
                    ]
                }
            }
        }
    };
}

exports.simpleSearch = (user_query, maxResults) => {
    let searchParams = queryWithUserString(user_query, maxResults);

    return client.search(searchParams)
        .then(res => res.hits.hits.map(x => x._source))
        .catch(err => Promise.resolve([]))
};

exports.feedbackSearch = (user_query, relevantDocuments, maxResults) => {
    let searchParams = queryWithUserString(user_query, maxResults);

    // comma separated
    let keywords = relevantDocuments
        .map(d => d.keywords)
        .reduce((x, y) => x + y, [])
        .join();

    // as array
    let entities = relevantDocuments
        .map(d => d.entities)
        .reduce((x, y) => x + y, []);

    // as array
    let sources = relevantDocuments
        .map(d => d.source);

    searchParams.body.query.bool.should = [
        {
            match: {
                fullText: {
                    query: keywords,
                    boost: 1
                },
            }
        },
        {
            terms: {
                'entities.keyword': entities,
                boost: 1
            }
        },
        {
            terms: {
                'sources.keyword': sources,
                boost: 1
            }
        }
    ];

    return client.search(searchParams)
        .then(res => res.hits.hits.map(x => x._source))
        .catch(err => Promise.resolve([]))
};

exports.connectionOk = () => client.ping({requestTimeout: 30000})
    .then(() => Promise.resolve(true))
    .catch(error => {
        console.error(error);
        return Promise.resolve(false)
    });
