import urllib.request, json
import os
from dotenv import load_dotenv, find_dotenv

class NewsAPI():
    def __init__(self):
        load_dotenv(find_dotenv())
        self.key = os.environ.get("APIKEY")
        self.news_sources = ["reuters", "cnn"]
        self.base_URI = "https://newsapi.org/v1/articles?"


    def getnews(self):
        listOfNews = []
        for source in self.news_sources:
            URI = self.base_URI + "source=" + source + "&apiKey=" + self.key
            with urllib.request.urlopen(URI) as response:
                news = json.loads(response.read().decode())
            for article in news['articles']:
                article['source'] = source
            listOfNews += (news['articles'])
        return listOfNews

if __name__ == '__main__':
    news_api = NewsAPI()

    print(news_api.getnews())
