const search = require('./search');
const $ = require('jquery');
import {UserService} from "./user.service";

export function handleClick(queryTerm) {
    if (queryTerm)
        search.search(queryTerm, UserService.user)
            .then(results => replaceResults(results, $('#results').find('.row')));
    return false;
}

function replaceResults(results, resultBox) {
    resultBox.empty();
    resultBox.append(results.map(createResultHtml))
}

function createResultHtml(doc) {
    let div = $(
        `<div class="col-md-3">
    <div class="card">
      <img class="card-img-top" src="${doc.urlToImage}" alt="Card image cap">
      <div class="card-block">
        <h5 class="card-title">${doc.title}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${doc.author}</h6>
        <p class="card-text">${doc.description}</p>
      </div>
      <div class="card-footer">
        <a href="${doc.url}" target="_blanc" class="btn btn-link doc-feedback"><span class="fa fa-external-link"></span> ${doc.source}</a>
        <button class="btn btn-link pull-right doc-feedback"><span class="fa fa-heart"></span></button>
      </div>
    </div>
</div>`);
    div.find('.doc-feedback').click(() => UserService.user.addDoc(doc));
    return div;
}
