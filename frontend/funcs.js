function handleClick(queryTerm) {
    if (queryTerm === "") {
        alert("Search for something...");
    }
    else {
        var maxResults = 10;
        //alert("You are searching for " + form.query.value);
        results = search.simpleSearch(queryTerm, maxResults);

        // TODO: Get results
        results = ["Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3", "Results1", "Results2", "Results3"];
        results = create_HTML_results(results);

        // Show results on screen
        for (i = 0; i < results.length; i++) {
            var id = "result_" + i.toString();
            document.getElementById(id).innerHTML = (i + 1).toString() + ". " + results[i];
        }
    }
    return false
}

function create_HTML_results(result_list) {
    res = "";
    for (i = 0; i < result_list.length; i++) {
        res = res + " " + (i + 1).toString() + " " + "." + " " + result_list[i] + "<br><br>";
    }
    return res;
}

function buttonReinforcment(num) {
    var id = "result_" + num.toString() + "_fb";
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
exports.create_HTML_results = create_HTML_results;
exports.buttonReinforcment = buttonReinforcment;
exports.submitRL = submitRL;