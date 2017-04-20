from tinydb import TinyDB, where

class NewsStorage:

    def __init__(self, db_path):
        self.db_path = db_path
        self.db = TinyDB(db_path)

    def add_news(self, news, check_if_exist=False):
        if check_if_exist:
            for doc in news:
                url = doc['url']
            if self.exists(url) is False:
                self.db.insert(doc)
        else:
            self.db.insert_multiple(news)

    def exists(self, url):
        return self.db.contains(where('url') == url)

    def get_all(self):
        return self.db.all()
