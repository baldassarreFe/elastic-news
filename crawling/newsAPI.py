import urllib.request, json
import os
from dotenv import load_dotenv, find_dotenv

base_URI = "https://newsapi.org/v1/articles?"
news_sources = ["reuters", "cnn"]

def getnews():
	load_dotenv(find_dotenv())
	listOfNews = []
	for source in news_sources:
		URI = base_URI + "source=" + source + "&apiKey=" + os.environ.get("APIKEY")
		with urllib.request.urlopen(URI) as response:
    			news = json.loads(response.read().decode())
		for article in news['articles']:
			article['source'] = source
		listOfNews.append(news)
	return listOfNews


