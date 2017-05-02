const search = require('./search');
const $ = require('jquery');
import {ElasticUser} from "./user";

export function handleClick(queryTerm) {
    if (queryTerm === "") {
        alert("Search for something...");
    }
    else {
        search.search(queryTerm, new ElasticUser())
            .then(results => replaceResults(results, $('#results .row')));
    }
    return false;
}

function replaceResults(results, resultBox) {
    resultBox.empty();
    resultBox.append(results.map(createResultHtml))
}

function createResultHtml(doc) {
    let div = $(
        `<div class="col-md-4">
    <div class="card">
      <div class="card-block">
        <h4 class="card-title">${doc.title}</h4>
        <h6 class="card-subtitle mb-2 text-muted">${doc.author}</h6>
        <p class="card-text">${doc.description}</p>
        <a href="${doc.url}" target="_blanc" class="card-link">Read on ${doc.source}</a>
      </div>
    </div>
</div>`);
    return div;
}