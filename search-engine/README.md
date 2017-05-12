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
to the configuration file `config/elasticsearch.yml` in the Elasticsearch folder.

```yaml
http.cors.enabled: true
http.cors.allow-origin: "*"
```

**Virtual memory settings for production use**

In case we want to enable the elasticsearch server for production (it's needed
to accept connections from outside localhost, e.g. testing from your phone) you
can add one of these to `config/elasticsearch.yml`:

- `network.host: ['<your ip address>', '_local_']`
- `network.host: 0.0.0.0`

(Check with `netstat -tuplen` that your ports are working)

You might also need to check the virtual memory map settings to be at least 262144:

```bash
cat /proc/sys/vm/max_map_count
```

In case it's not, you can change it until the next reboot:

```bash
sudo sysctl -w vm.max_map_count=262144
```

or permanently by adding the line `vm.max_map_count=262144` to `/etc/sysctl.conf`.

**Script for calculating boost value used by Elastic

Copy the file boostData.painless under ~/elasticsearch-5.3.0/config/scripts/

'''bash
cp boostDate.painless ~/elasticsearch-5.3.0/config/scripts/
'''


