from elasticsearch import Elasticsearch

import crawler


class ElasticClient:
    def __init__(self):
        self.es = Elasticsearch()

    def index(self, doc):
        return self.es.index(
            index='news',
            doc_type='article',
            id=doc['url'],
            body=doc)


if __name__ == '__main__':
    ec = ElasticClient()

    for doc in crawler.load_docs():
        ec.index(doc)

    es.indices.refresh(index="news")

    res = es.search(index="news", body={
        "size": 100,
        "query": {
            "match_all": {}
        }
    })
    print("Got %d Hits:" % res['hits']['total'])
    for hit in res['hits']['hits']:
        doc = hit["_source"]
        print("{title} - {author}: {url}".format(**doc))
