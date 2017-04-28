# Querying Elasticsearch

## Get all the entries

```bash
curl -X GET 'http://localhost:9200/news/article/_search?explain&pretty' -d \
'{
  "query": {
    "match_all": {}
  }
}'
```

## Search on a single term without analysis
https://www.elastic.co/guide/en/elasticsearch/guide/master/scoring-theory.html

```bash
curl -X GET 'http://localhost:9200/news/article/_search?explain&pretty' -d \
'{
  "query": {
    "term": {
      "fullText": "election"
    }
  }
}'
```

## Multiword
https://www.elastic.co/guide/en/elasticsearch/guide/master/practical-scoring-function.html

```bash
curl -X GET 'http://localhost:9200/news/article/_search?explain&pretty' -d \
'{
  "query": {
    "bool": {
      "should": [
        {"term": { "fullText": "election" }},
        {"term": { "fullText": "party"   }}
      ]
    }
  }
}'
```

Which is like

```bash
curl -X GET 'http://localhost:9200/news/article/_search?explain&pretty' -d \
'{
  "query": {
    "match": {
      "fullText": "election party"
    }
  }
}'
```

## Using the keywords from relevant documents to search in the full text
Once we get a feedback from the user we use the keywords (extracted by Watson)
from the documents he selected to search inside the fullText field.

* We use commas to separate the entities so that "new york", "city" does not become
the tri-gram "new york city".
* Repeating keywords (like in *the user has selected many documents and "city"
appears* many times) gives more importance to that keyword.

```bash
curl -X GET 'http://localhost:9200/news/article/_search?explain&pretty' -d \
'{
  "query": {
    "match": {
      "fullText": "New Youk, city, election, SeNaTE, election"
    }
  }
}'
```

## On the entities
Once we get a feedback from the user we use the entities from the results
and boost articles that have overlapping entities.
Which means that we do not require all the entities to be present, but the more the better.

* Using ```terms``` means that we don't send our entities through an analyzer and
  searching for the entity "Donald Trump" will not match with "Trump"
* It also means that "Donald trump" will not match "Donald Trump", but given that
  we extract entities from Watson their casing should be uniform.

```bash
curl -X GET 'http://localhost:9200/news/article/_search?explain&pretty' -d \
'{
  "size": 2,
  "query": {
    "terms": {
      "entities.keyword": [
        "Donald Trump",
        "Senate"
      ]
    }
  }
}'
```

## On the sources
Once we get a feedback from the user we use the sources from the results
and boost articles from those sources.

Using ```term``` means that we don't send our sources through an analyzer

```bash
curl -X GET 'http://localhost:9200/news/article/_search?explain&pretty' -d \
'{
  "size": 2,
  "query": {
    "bool": {
      "should": [
        {
          "term": {
            "source.keyword": {
              "value": "cnn",
              "boost": 5
            }
          }
        },
        {
          "term": {
            "source.keyword": {
              "value": "reuters",
              "boost": 2
            }
          }
        }
      ]
    }
  }
}'
```

## Putting together and boosting
https://www.elastic.co/guide/en/elasticsearch/guide/master/query-time-boosting.html

The title field will probably already have a “natural” boost over the content
field thanks to the field-length norm (titles are usually shorter than the related content),
so don’t blindly boost fields just because you think they should be boosted.
Apply a boost and check the results.
Change the boost and check again.
```bash
curl -X GET 'http://localhost:9200/news/article/_search?explain&pretty' -d \
'{
  "size": 2,
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "title": {
              "query": "Trump",
              "boost": 2
            }
          }
        },
        {
          "match": {
            "fullText": "last year"
          }
        },
        {
          "terms": {
            "entities.keyword": [
              "Trump",
              "Senate"
            ],
            "boost": 3
          }
        }
      ]
    }
  }
}'
```

```
GET _search
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "Trump",
            "fields": ["fullText^1", "title^2"]
          }
        }
      ],
      "should": [
        {
          "match": {
            "fullText": "New York, program, Foreign, program"
          }
        },
        {
          "terms": {
            "entities.keyword": [
              "Germany"
              ]
          }
        },
        {
          "term": {
            "source.keyword": {
              "value": "cnn",
              "boost": 3
            }
          }
        },
        {
          "term": {
            "source.keyword": {
              "value": "reuters",
              "boost": 6
            }
          }
        },
        {
          "match": {
            "author": "Tal"
          }
        }
      ]
    }
  }
}
```
