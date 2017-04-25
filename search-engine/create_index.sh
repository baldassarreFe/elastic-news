curl -XPUT 'localhost:9200/news?pretty' \
	-H 'Content-Type: application/json' \
	-d \
'{
  "mappings": {
    "article": {
      "_all":       { "enabled": false  },
      "properties": {
        "title":       { "type": "text"  },
        "author":      { "type": "text"  },
        "fullText":    { "type": "text"  },
        "description": { "type": "text"  },
        "source":      { "type": "text"  },
        "url":         { "type": "text"  },
        "urlToImage":  { "type": "text"  },
        "createdAt":   { "type": "date", }
      }
    }
  }
}
'
