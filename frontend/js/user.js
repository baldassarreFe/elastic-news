export class ElasticUser {
    constructor(otherUser) {
        this.keywords = [];
        this.entities = [];
        this.authors = [];
        this.sources = [];
        this.publishedDates = [];
        this.listeners = [];
        if (otherUser)
            Object.assign(this, otherUser);
    }

    addListener(callback) {
        this.listeners.push(callback);
        callback(this);
    }

    notifyListeners() {
        this.listeners.forEach(c => c(this));
    }

    clear() {
        this.keywords = [];
        this.entities = [];
        this.authors = [];
        this.sources = [];
        this.notifyListeners();
    }

    addDoc(doc) {
        addToList(this.keywords, doc.keywords);
        addToList(this.entities, doc.entities);
        addToList(this.authors, [doc.author]);
        addToList(this.sources, [doc.source]);
        addToList(this.publishedDates, [doc.publishedAt.substring(0,10)]);
        this.notifyListeners();
    }

    toJSON() {
        return {
            keywords: this.keywords,
            entities: this.entities,
            authors: this.authors,
            sources: this.sources,
            publishedDates: this.publishedDates
        }
    }
}

function addToList(keyValueList, otherList) {
    otherList.forEach(k => {
        let kv = keyValueList.find(kv => kv.value === k);
        if (kv) {
            kv.count++;
        } else {
            keyValueList.push({
                value: k,
                count: 1
            })
        }
    });
    keyValueList.sort((a, b) => b.count - a.count);
}
