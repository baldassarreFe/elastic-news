const search = require('./search');
const $ = require('jquery');

function handleClick(queryTerm) {
    if (queryTerm === "") {
        alert("Search for something...");
    }
    else {
        let maxResults = 10;
        search.simpleSearch(queryTerm, maxResults)
            .then(results => replaceResults(results, $('#initial-results')));
    }
    return false
}

function replaceResults(results, resultBox) {
    resultBox.empty();
    resultBox.append(results.map(createResultHtml))
}

function createResultHtml(doc) {
    let div = $(`<div>
<a href="${doc.url}" target="_blanc"><h3>${doc.title}</h3></a>
</div>`);
    return div;
}

function buttonReinforcment(num) {
    let id = "result_" + num.toString() + "_fb";
    if (!document.getElementById(id).innerHTML) {
        document.getElementById(id).innerHTML = num.toString();
    }
    else {
        document.getElementById(id).innerHTML = "";
    }

}

function submitRL() {
    alert("TODO: submitRL()");
    // TODO: Submit all document.getElementById(result_X_fb).innerHTML where 1 <= X <= 10 to ElasticSearch
}


exports.handleClick = handleClick;
exports.buttonReinforcment = buttonReinforcment;
exports.submitRL = submitRL;