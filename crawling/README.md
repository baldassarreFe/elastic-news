# Crawling the web for news

## Api used
* [NewsAPI](https://newsapi.org)
* [IBM Watson](https://www.ibm.com/watson/developercloud/natural-language-understanding.html)

## Elasticsearch requirements

Follow [this guide](https://www.elastic.co/guide/en/elasticsearch/reference/5.3/_installation.html)
to install Elasticsearch 5.3, in short do this in some folder:

```bash
curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.3.0.tar.gz
tar -xvf elasticsearch-5.3.0.tar.gz
rm elasticsearch-5.3.0.tar.gz
cd elasticsearch-5.3.0/bin
./elasticsearch -Ecluster.name=news_cluster -Enode.name=news_node_1
```

## Kibana for ease of testing

```bash
wget https://artifacts.elastic.co/downloads/kibana/kibana-5.3.1-darwin-x86_64.tar.gz
shasum kibana-5.3.1-darwin-x86_64.tar.gz
tar -xzf kibana-5.3.1-darwin-x86_64.tar.gz
cd kibana-5.3.1-darwin-x86_64
./bin/kibana
```

Go to [http://localhost:5601](http://localhost:5601)

## Python requirements
* python 3
* watson-developer-cloud
* beautifulsoup4
* python-dotenv
* elasticsearch-py
```
pip3 install watson_developer_cloud \
             beautifulsoup4 \
             python-dotenv \
             lxml \
             elasticsearch
```

or

```
python3 -m venv --system-site-packages --symlinks env
source env/bin/activate
pip install -r requirements.txt
```
