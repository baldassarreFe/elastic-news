# Set up elasticsearch and Kibana

**Elasticsearch requirements**

Follow [this guide](https://www.elastic.co/guide/en/elasticsearch/reference/5.3/_installation.html)
to install Elasticsearch 5.3, in short do this in some folder:

```bash
curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.3.0.tar.gz
tar -xvf elasticsearch-5.3.0.tar.gz
rm elasticsearch-5.3.0.tar.gz
cd elasticsearch-5.3.0/bin
./elasticsearch -Ecluster.name=news_cluster -Enode.name=news_node_1
```

**Kibana for ease of testing**

```bash
wget https://artifacts.elastic.co/downloads/kibana/kibana-5.3.1-darwin-x86_64.tar.gz
shasum kibana-5.3.1-darwin-x86_64.tar.gz
tar -xzf kibana-5.3.1-darwin-x86_64.tar.gz
cd kibana-5.3.1-darwin-x86_64
./bin/kibana
```

Go to [http://localhost:5601](http://localhost:5601)

**Cors**

To allow the front end to directly invoke queries on Elasticsearch, add these lines
to the configuration file ```config/elasticsearch.yml``` in the Elasticsearch folder.
```yaml
http.cors.enabled: true
http.cors.allow-origin: "*"
```
