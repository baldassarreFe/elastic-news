import {Client} from "elasticsearch";
import {elasticsearchUrls, maxResults, verbose} from "./settings";
const Promise = require('promise');

let client = new Client({
    host: elasticsearchUrls,
    log: ['error', 'warning']
});

function baseQuery(originalQuery) {
    return {
        index: 'news',
        type: 'article',
        body: {
            size: maxResults,
            query: {
                function_score: {
                    query: {
                        bool: {
                            must: [
                                {
                                    multi_match: {
                                        query: originalQuery,
                                        fields: ["fullText^1", "title^2"]
                                    }
                                }
                            ],
                            should: []
                        }
                    },
                    field_value_factor: {
                        field: "publishedAt",
                        modifier: "sqrt",
                        missing: 1483225200000 //2017-01-01 00:00:00
                    }                       
                }
            }
        }
    };
}

/**
 * Creates queries like:
 * <pre><code>
 * {
 *   "bool": {
 *     "should": [
 *       {
 *         "match": {
 *         "fullText": {
 *           "query": "best restaurant in town",
 *           "boost": 3
 *         }
 *       },
 *       {
 *         "terms": {
 *           "entities.keyword": ["Pizza", "Pasta"],
 *           "boost": 3
 *         }
 *       }
 *     ],
 *     "boost": 2
 *   }
 * }
 * </pre></code>
 * The inner boost value affect the weight of that query among
 * the other queries in the should array.
 *
 * The outer boost instead is applied to the whole query and it
 * is useful if the resulting query will be nested in e.g. an
 * array of should queries
 */
function subquery(shouldClausesArray, subQueryBoost = 1) {
    return {
        bool: {
            should: shouldClausesArray,
            boost: subQueryBoost
        }
    }
}

/**
 * Creates queries like:
 * <pre><code>
 * {
 *   "match": {
 *     "fullText": {
 *       "query": "best restaurant in town",
 *       "boost": 3
 *     }
 *   }
 * }
 * </pre></code>
 */
function matchQuery(fieldName, queryString, boost = 1) {
    return {
        match: {
            [fieldName]: {
                query: queryString,
                boost: boost
            }
        }
    }
}

/**
 * Creates queries like:
 * <pre><code>
 * {
 *   "terms": {
 *     "entities.keyword": ["Pizza", "Pasta"],
 *     "boost": 3
 *   }
 * }
 * </pre></code>
 */
function termsQuery(fieldName, termsArray, boost = 1) {
    return {
        terms: {
            [fieldName]: termsArray,
            boost: boost
        }
    }
}

/**
 * Creates queries like:
 * <pre><code>
 * {
 *   "term": {
 *     "entities.keyword": {
 *       "value": "Pizza",
 *       "boost": 3
 *     }
 *   }
 * }
 * </pre></code>
 */
function termQuery(fieldName, term, boost = 1) {
    return {
        term: {
            [fieldName]: {
                value: term,
                boost: boost
            }
        }
    }
}


function rangeQuery(fieldName, term, boost = 1) {
    return {
        range: {
            [fieldName]: {
                "gte": term + "-1d/d",
                "lt": term + "/d",
                boost: boost
            }
        }
    }
}

function queryBody(originalQuery, user) {
    let q = baseQuery(originalQuery);

    if (user) {

        q.body.query.function_score.query.bool.should.push(subquery(
            user.keywords.slice(0, 10)
                .map(kv => matchQuery('fullText', kv.value, kv.count)),
            2
        ));


        q.body.query.function_score.query.bool.should.push(subquery(
            user.entities.slice(0, 10)
                .map(kv => termQuery('entities.keywords', kv.value, kv.count)),
            2
        ));


        q.body.query.function_score.query.bool.should.push(subquery(
            user.sources.slice(0, 10)
                .map(kv => termQuery('sources.keywords', kv.value, kv.count)),
            2
        ));


        q.body.query.function_score.query.bool.should.push(subquery(
            user.authors.slice(0, 10)
                .map(kv => termQuery('author.keyword', kv.value, kv.count)),
            2
        ));


        q.body.query.function_score.query.bool.should.push(subquery(
            user.publishedDates.slice(0, 10)
                .map(kv => rangeQuery('publishedDates.keywords', kv.value, kv.count)),
            1
        ));
    }
    if (verbose) {
        console.log(JSON.stringify(q.body, null, 2))
    }
    return q;
}

export function search(userQuery, user) {
    let searchParams = queryBody(userQuery, user);

    return client.search(searchParams)
        .then(res => res.hits.hits.map(
            x => Object.assign(x._source, {score: x._score})))
        .catch(err => Promise.resolve([]))
}

export function connectionOk() {
    return client.ping({requestTimeout: 30000})
        .then(() => Promise.resolve(true))
        .catch(error => {
            console.error(error);
            return Promise.resolve(false)
        });
}
