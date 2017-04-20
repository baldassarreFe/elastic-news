#!/bin/python3

from newsAPI import NewsAPI
from newsStorage import NewsStorage
from text_processing import ArticleParser
from text_extractor.text_extractor import TextExtractor

import sys

db_path = "documents.json"

class Crawler:

    def get_docs(self, db):
        new_api = NewsAPI()
        news = new_api.getnews()

        ap = ArticleParser()
        te = TextExtractor()

        docs = []
        for doc in news:
            doc_url = doc['url']
            if db.exists(doc_url):
                sys.stderr.write("Already exists, skipping " + doc_url + "\n")
                continue
            parsed = ap.parse_article(doc)
            annotated = None
            try:
                annotated = te.annotateDoc(parsed)
            except:
                sys.stderr.write("Skipping doc, problem with parsing for " + doc_url + "\n")
            if annotated is not None:
                print("Adding " + doc_url)
                docs.append(annotated)

        return docs


def main(argv):

    storage = NewsStorage(db_path)

    crawler = Crawler()
    news = crawler.get_docs(storage)

    storage.add_news(news)

def load_docs():
    storage = NewsStorage(db_path)
    all_docs = storage.get_all()
    print(len(all_docs), "docs")
    print("Example:")
    print(all_docs[0])

if __name__ == "__main__":
    main(sys.argv)
    #load_docs()
