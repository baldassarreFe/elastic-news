var search = require('./search.js');

function handleClick(queryTerm) {
    if (queryTerm === "") {
        alert("Search for something...");
    }
    else {
        //alert("You are searching for " + form.query.value);
        results = search.simpleSearch(queryTerm)

        // TODO: Get results
        results = ["Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3"];
        results = create_HTML_results(results);

        // Show results on screen
        document.getElementById('display').innerHTML = results;
    }
    return false
}

function create_HTML_results (result_list) {
    res = "";
    for (i = 0; i < result_list.length; i++) {
        res = res + " " + (i + 1).toString() + " " + "." + " " + result_list[i] + "<br><br>";
    }
    return res;
}

exports.handleClick = handleClick;
exports.create_HTML_results  = create_HTML_results ;