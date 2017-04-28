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
        var searchParams = {
            index: 'news',
            type: 'article',
            body:{
                query:{
                    bool:{
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

        var length = relevantDocuments.length;
        var length_key;
        var length_ent;
        var keywords = [];
        var entities = [];
        var keywords_temp = [];
        var entities_temp = [];
        for(var i = 0; i < length; i++)
        {
            keywords_temp = relevantDocuments[i].keywords;
            entities_temp = relevantDocuments[i].entities;
            length_key = keywords_temp.length;
            length_ent = entities_temp.length;

            for(var a = 0; a < length_key; a++)
            {
                if(!keywords.includes(keywords_temp[a]))
                {
                    keywords.push(keywords_temp[a]);
                }
            }
            for(var b = 0; b < length_ent; b++)
            {
                if(!entities.includes(entities_temp[b]))
                {
                    entities.push(entities_temp[b]);
                }
            }
        }

        client.search(searchParams, function(err, res){
            if(err){
                throw err;
            }

            
        })
    }
}
