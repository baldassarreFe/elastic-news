const funcs = require('./funcs');
const search = require('./search');
const $ = require('jquery');
global.$ = $;
global.jQuery = $;
import tether from "tether";
global.Tether = tether;
require('bootstrap');

function connectionErrorMessage() {
    search.connectionOk().then(ok => {
        if (ok)
            $('#display-error').hide();
        else
            $('#display-error').show();
    });
    setTimeout(connectionErrorMessage, 10000)
}

$('document').ready(function () {
    connectionErrorMessage();

    $('#search-bar form').bind('submit', event => {
        event.preventDefault();
        funcs.handleClick(event.target.query.value);
    });

    $('#search-bar form').delegate(':input', 'focus', () => $('#header-img').collapse()
    )
});