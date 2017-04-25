from article_parsing import *
from newsAPI import NewsAPI

if __name__ == '__main__':
    news_api = NewsAPI()

    ap = ArticleParser()    

    i = 0
    for article in news_api.getnews():
        article = ap.parse_article(article)
        if article is not None:
            i+=1
            print(article)
    print(str(i) + " news found.")
