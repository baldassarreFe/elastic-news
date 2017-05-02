var funcs = require('./funcs');
var search = require('./search');
var $ = require('jquery');

function connectionErrorMessage() {
    search.connectionOk().then(function(ok) {
        if (ok)
            $('#display-error').hide();
        else
            $('#display-error').show();
    });
    setTimeout(connectionErrorMessage, 10000)
}

$('document').ready(function () {
    connectionErrorMessage();

    $('#search-form').bind('submit', function(event) {
        event.preventDefault();
        funcs.handleClick(event.target.query.value);
    });
});