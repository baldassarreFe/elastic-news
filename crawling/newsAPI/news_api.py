import json
import os
import urllib.request
from os.path import join, dirname

from dotenv import load_dotenv


class NewsAPI():
    def __init__(self):
        dotenv_path = join(dirname(__file__), '.env')
        load_dotenv(dotenv_path)
        self.key = os.environ.get("APIKEY")
        self.news_sources = ["reuters", "cnn", "the-guardian-uk", "the-new-york-times", "bbc-news", "daily-mail", "the-economist", "business-insider"]
        self.base_URI = "https://newsapi.org/v1/articles?"

    def getnews(self):
        listOfNews = []
        for source in self.news_sources:
            URI = self.base_URI + "source=" + source + "&apiKey=" + self.key
            with urllib.request.urlopen(URI) as response:
                news = json.loads(response.read().decode())
            i = 0
            while i < len(news['articles']):
                if (not news['articles'][i]['author']):
                    del news['articles'][i]
                    i = i - 1
                else:
                    news['articles'][i]['source'] = source
                i = i + 1
            listOfNews += (news['articles'])
        return listOfNews


if __name__ == '__main__':
    news_api = NewsAPI()

    print(json.dumps(news_api.getnews(), indent=4, sort_keys=True))
