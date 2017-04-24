from datetime import datetime

from elasticsearch import Elasticsearch


class ElasticClient:
    def __init__(self):
        self.es = Elasticsearch()

    def index(self, doc):
        return self.es.index(index="test-index", doc_type='tweet', id=doc['url'], body=doc)


if __name__ == '__main__':
    es = Elasticsearch()

    doc = {
        'author': 'kimchy',
        'url': 'www.google.se',
        'text': 'Elasticsearch: cool. bonsai cool.',
        'timestamp': datetime.now(),
    }

    ec = ElasticClient()
    ec.index(doc)

    res = es.get(index="test-index", doc_type='tweet', id=1)
    print(res['_source'])

    es.indices.refresh(index="test-index")

    res = es.search(index="test-index", body={"query": {"match_all": {}}})
    print("Got %d Hits:" % res['hits']['total'])
    for hit in res['hits']['hits']:
        print("%(timestamp)s %(author)s: %(text)s" % hit["_source"])
