const search = require('./search');
const $ = require('jquery');
const moment = require('moment');
import {verbose} from "./settings";
import {UserService} from "./user.service";

export function handleClick(queryTerm) {
    if (queryTerm)
        search.search(queryTerm, UserService.user)
            .then(results => replaceResults(results, $('#results').find('.with-history')));
    search.search(queryTerm, null)
        .then(results => replaceResults(results, $('#results').find('.neutral')));
    return false;
}

function replaceResults(results, resultBox) {
    resultBox.empty();
    resultBox.append(results.map(createResultHtml))
}

function createResultHtml(doc) {
    let div = $(
        `<div class="col-md-6">
    <div class="card">
      ${createCardImage(doc)}
      <div class="card-block">
        <h5 class="card-title">${doc.title}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${doc.author}</h6>
        <p class="card-text">${doc.description}</p>
        <p class="card-text pull-right"><small class="text-muted">${moment(doc.publishedAt).format('Do MMM YY')}</small></p>
      </div>
      <div class="card-footer">
        <a href="${doc.url}" target="_blanc" class="btn btn-sm btn-link doc-feedback"><span class="fa fa-external-link"></span> ${doc.source}</a>
        <button class="btn btn-sm btn-link pull-right doc-feedback"><span class="fa fa-heart"></span></button>
      </div>
    </div>
</div>`);
    div.find('.doc-feedback').click(() => UserService.user.addDoc(doc));
    return div;
}

function createCardImage(doc) {
    if (verbose)
        return `
        <div class="img-container">
            <img class="card-img-top" src="${doc.urlToImage}" alt="Card image cap">
            <div class="score-overlay"><div class="score-box">${doc.score}</div></div>
        </div>`;
    else
        return `<img class="card-img-top" src="${doc.urlToImage}" alt="Card image cap">`;
}
