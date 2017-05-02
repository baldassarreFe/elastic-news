export class ElasticUser {
    constructor() {
        this.keywords = [];
        this.entities = [];
        this.authors = [];
        this.sources = [];
    }

    addDoc(doc) {
        addToList(this.keywords, doc.keywords);
        addToList(this.entities, doc.entities);
        this.sources[doc.author] = (this.authors[doc.author] | 0) + 1;
        this.sources[doc.source] = (this.sources[doc.source] | 0) + 1;
    }
}

function addToList(keyValueList, otherList) {
    otherList.forEach(k => {
        kv = keyValueList.find(kv => kv.value === k);
        if (kv) {
            kv.count++;
        } else {
            keyValueList.push({
                value: k,
                count: 1
            })
        }
    });
    otherList.sort((a, b) => b.value - a.value)
}