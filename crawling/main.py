from text_processing import *
from newsAPI import NewsAPI

if __name__ == '__main__':
    news_api = NewsAPI()

    ap = ArticleParser()
    ap.add_parser('reuters', reuters_parser)
    ap.add_parser('cnn', cnn_parser)

    for article in news_api.getnews():
        article = ap.parse_article(article)
        print(article['fullText'])
