import urllib.request
from http.cookiejar import CookieJar
from bs4 import BeautifulSoup
import gzip

#from text_enrichment.text_enrichment import TextEnricher


class ArticleParser():
    def __init__(self):
        self.parsers = all_parsers()

    def parse_article(self, article_metadata):
        cj = CookieJar()
        opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
        request = urllib.request.Request(article_metadata['url'])
        try:
            response = opener.open(request)
        except:
            return None
        article_html = response.read();
        if response.info().get('Content-Encoding') == 'gzip':
            article_html = gzip.decompress(article_html)
        article_soup = BeautifulSoup(article_html, 'lxml')
        return self.parsers[article_metadata['source']](article_metadata, article_soup)

    def add_parser(self, source, parser):
        self.parsers[source] = parser


# TODO move these functions to another file
def reuters_parser(article_metadata, article_soup):
    if article_soup.find(id="article-text"):
        return {**article_metadata,'fullText': ''.join([p.get_text() for p in article_soup.select('#article-text > p')])}
    else:
        return None

def cnn_parser(article_metadata, article_soup):
    if article_soup.find("div", { "class" : "zn-body__paragraph" }):
        paragraphs = article_soup.select('.zn-body__paragraph')
        # Remove <cite class="el-editorial-source"> (CNN)</cite> from first paragraph
        if len(paragraphs) > 0:
            citation = paragraphs[0].select(".el-editorial-source")
            if len(citation) > 0:
                citation[0].extract()
        return {**article_metadata,'fullText': ''.join([p.get_text() for p in paragraphs])}
    else:
        return None

def the_guardian_uk_parser(article_metadata, article_soup):
    if article_soup.find("div", {"class": "content__article-body from-content-api js-article__body"}):
        paragraphs = article_soup.find("div", {"class": "content__article-body from-content-api js-article__body"})
        return {**article_metadata, 'fullText': ''.join([p.get_text() for p in paragraphs.select('p')])}
    else:
        return None

def the_new_york_times_parser(article_metadata, article_soup):
    if article_soup.find("p", {"class": "story-body-text story-content"}):
        return {**article_metadata,'fullText': ''.join([p.get_text() for p in article_soup.select(".story-body-text.story-content")])}
    else:
        return None

def bbc_news_parser(article_metadata, article_soup):
    if article_soup.find("div", {"class": "story-body"}):
        return {**article_metadata,'fullText': ''.join([p.get_text() for p in article_soup.select(".story-body > .story-body__inner > p")])}
    else:
        return None

def daily_mail_parser(article_metadata, article_soup):
    if article_soup.find("div", {"itemprop": "articleBody"}):
        return {**article_metadata,'fullText': ''.join([p.get_text() for p in article_soup.find("div", {"itemprop": "articleBody"}).select("p")])}
    else:
        return None

def the_economist_parser(article_metadata, article_soup):
    if article_soup.find("div", {"class": "blog-post__text"}):
        return {**article_metadata,'fullText': ''.join([p.get_text() for p in article_soup.find("div", {"class": "blog-post__text"}).select("p")])}
    else:
        return None

def business_insider_parser(article_metadata, article_soup):
    if article_soup.find("div", {"class": "article-body"}):
        return {**article_metadata,'fullText': ''.join([p.get_text() for p in article_soup.find("div", {"class": "article-body"}).select("p")])}
    elif article_soup.find("div", {"class": "KonaBody post-content"}):
        return {**article_metadata,'fullText': ''.join([p.get_text() for p in article_soup.find("div", {"class": "KonaBody post-content"}).select("p")])}
    else:
        return None

def independent_parser(article_metadata, article_soup):
    if article_soup.find("div", {"itemprop": "articleBody"}):
        return {**article_metadata,'fullText': ''.join([p.get_text() for p in article_soup.find("div", {"itemprop": "articleBody"}).select("p")])}
    else:
        return None

def fortune_parser(article_metadata, article_soup):
    if article_soup.find("article", {"class": "row"}):
        return {**article_metadata,'fullText': ''.join([p.get_text() for p in article_soup.find("article", {"class": "row"}).select("p")])}
    else:
        return None

def time_parser(article_metadata, article_soup):
    if article_soup.find("article", {"class": "row"}):
        return {**article_metadata,'fullText': ''.join([p.get_text() for p in article_soup.find("article", {"class": "row"}).select("p")])}
    else:
        return None

def bbc_sport_parser(article_metadata, article_soup):
    if article_soup.find("div", {"class": "story-body"}):
        return {**article_metadata,'fullText': ''.join([p.get_text() for p in article_soup.find("div", {"class": "story-body"}).findAll("p")])}
    else:
        return None

def all_parsers():
    return {
        "reuters": reuters_parser,
        "cnn": cnn_parser,
        "the-guardian-uk": the_guardian_uk_parser,
        "the-new-york-times": the_new_york_times_parser,
        "bbc-news": bbc_news_parser,
        "daily-mail": daily_mail_parser,
        "the-economist": the_economist_parser,
        "business-insider": business_insider_parser,
        "independent": independent_parser,
        "fortune": fortune_parser,
        "time": time_parser,
        "bbc-sport": bbc_sport_parser
    }


if __name__ == '__main__':
    articles = [{
        'author': 'Lesley Wroughton and Yeganeh Torbati',
        'source': 'reuters',
        'title': 'U.S. air strike gives Tillerson a boost for Moscow talks',
        'description': "U.S. Secretary of State Rex Tillerson's visit to Moscow this week will be an early test of whether the Trump administration can use any momentum generated by striking a Syrian air base to craft and execute a strategy to end the Syrian war.",
        'url': 'http://www.reuters.com/article/us-usa-russia-tillerson-idUSKBN17C0D4',
        'urlToImage': 'http://s3.reutersmedia.net/resources/r/?m=02&d=20170410&t=2&i=1180051153&w=&fh=545px&fw=&ll=&pl=&sq=&r=LYNXMPED39077',
        'publishedAt': '2017-04-10T08:08:52Z'
    },
        {
            "author": "Ben Westcott, CNN",
            "source": "cnn",
            "title": "US warns Russia over support for Assad",
            "description": "Foreign ministers of leading industrialized nations were meeting Monday amid heightened tensions between Russia and the United States over the Trump administration's unexpected military strike on a Syrian airbase.",
            "url": "http://www.cnn.com/2017/04/10/politics/syria-russia-iran-missile-strikes/index.html",
            "urlToImage": "http://i2.cdn.cnn.com/cnnnext/dam/assets/170328141858-russia-jet-syria-tease-super-tease.jpg",
            "publishedAt": "2017-04-10T09:59:38Z"
        },
        {
            "author": "Dan Roberts, Lisa O'Carroll",
            "source": "the-guardian-uk",
            "title": "European parliament chief urges May to agree swift deal on EU citizens",
            "description": "Antonio Tajani presses PM to defend rights of those in UK and strikes more positive note than some on timing of trade talks",
            "url": "https://www.theguardian.com/politics/2017/apr/20/european-parliament-chief-urges-may-to-agree-swift-deal-on-eu-citizens",
            "urlToImage": "https://i.guim.co.uk/img/media/2167d3a064f8c3fecea66292e9f395c58bc69d6a/0_216_5148_3089/master/5148.jpg?w=1200&h=630&q=55&auto=format&usm=12&fit=crop&crop=faces%2Centropy&bm=normal&ba=bottom%2Cleft&blend64=aHR0cHM6Ly91cGxvYWRzLmd1aW0uY28udWsvMjAxNi8wNS8yNS9vdmVybGF5LWxvZ28tMTIwMC05MF9vcHQucG5n&s=355554190462a67ac23423766b5efa3d",
            "publishedAt": "2017-04-20T12:25:00Z"
        },
        {
            "author": "Mike Isaac",
            "source": "the-new-york-times",
            "title": "Uber’s C.E.O. Plays With Fire",
            "description": "Travis Kalanick’s drive to win in life has led to a pattern of risk-taking that has at times put his ride-hailing company on the brink of implosion.",
            "url": "https://www.nytimes.com/2017/04/23/technology/travis-kalanick-pushes-uber-and-himself-to-the-precipice.html",
            "urlToImage": "https://static01.nyt.com/images/2017/04/19/technology/24travis/00travis-facebookJumbo.gif",
            "publishedAt": "2017-04-24T13:47:55Z"
        },
        {
            "author": "BBC News",
            "source": "bbc-news",
            "title": "French election: Hollande urges nation to back Macron and reject Le Pen",
            "description": "President says Emmanuel Macron will \"defend the values which will bring French people together\".",
            "url": "http://www.bbc.co.uk/news/world-europe-39695686",
            "urlToImage": "https://ichef.bbci.co.uk/news/1024/cpsprodpb/AA24/production/_95765534_mediaitem95765533.jpg",
            "publishedAt": "2017-04-24T18:15:08+00:00"
        },
        {
            "author": "By Chris Pleasance",
            "source": "daily-mail",
            "title": "British woman is savaged by a shark at Ascension Island",
            "description": "Dean Gonsalves came to his wife Frankie's aid off the coats of Ascension Island and punched the shark in the nose, forcing it to retreat after it had savaged her leg.",
            "url": "http://www.dailymail.co.uk/news/article-4439316/British-woman-savaged-shark-Ascension-Island.html",
            "urlToImage": "http://i.dailymail.co.uk/i/pix/2017/04/24/18/3F907DD400000578-0-image-a-44_1493055733700.jpg",
            "publishedAt": "2017-04-24T17:44:15Z"
        },
        {
            "author": "The Economist",
            "source": "the-economist",
            "title": "New Brazilian corruption probes and their consequences",
            "description": "Despite a mounting scandal, the government soldiers on",
            "url": "http://www.economist.com/news/americas/21721235-despite-mounting-scandal-government-soldiers-new-brazilian-corruption-probes-and-their",
            "urlToImage": "http://cdn.static-economist.com/sites/default/files/images/print-edition/20170422_AMD001_0.jpg",
            "publishedAt": "2017-04-20T14:48:45+00:00"
        },
        {
            "author": "Allan Smith",
            "source": "business-insider",
            "title": "John Kasich, a former Fox News host, responds to Bill O'Reilly's ouster",
            "description": "Kasich, who hosted a Fox News program, said he \"wouldn't have stayed\" at the right-leaning news network if he witnessed a culture of sexual harassment.",
            "url": "http://www.businessinsider.com/john-kasich-fox-news-bill-oreilly-2017-4",
            "urlToImage": "http://static4.businessinsider.com/image/58fe3e3f7522ca3a268b590e-1190-625/john-kasich-a-former-fox-news-host-responds-to-bill-oreillys-ouster.jpg",
            "publishedAt": "2017-04-24T19:18:30+00:00"
        }]

    ap = ArticleParser()
    

    #te = TextEnricher()

    for article in articles:
        parsed = ap.parse_article(article)
        #annotated = te.enrichDocument(parsed)
        print(parsed)
