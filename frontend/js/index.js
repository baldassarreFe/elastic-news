const funcs = require('./funcs');
const search = require('./search');
const $ = require('jquery');
global.$ = $;
global.jQuery = $;
import tether from "tether";
import {UserService} from "./user.service";
global.Tether = tether;
require('bootstrap');

$('document').ready(function () {
    // Find elements with jQuery
    let searchForm = $('#search-bar').find('form');

    // Handle connection issues
    connectionErrorMessage();

    // Hide big header when the search bar is activated
    searchForm.delegate(':input', 'focus', () => $('#header-img').collapse());

    // Handle search events
    searchForm.bind('submit', event => {
        event.preventDefault();
        funcs.handleClick(event.target.query.value);
    });

    // Bind user to user details view
    UserService.user.addListener(showUserDetails)
});

function showUserDetails(user) {
    $('#keywords-list').html(user.keywords.slice(0, 10).map(kv => fillBadge(kv, 'success')).join(' '));
    $('#entities-list').html(user.entities.slice(0, 10).map(kv => fillBadge(kv, 'info')).join(' '));
    $('#sources-list').html(user.sources.slice(0, 10).map(kv => fillBadge(kv, 'warning')).join(' '));
    $('#authors-list').html(user.authors.slice(0, 10).map(kv => fillBadge(kv, 'primary')).join(' '));
    $('#publishedDates-list').html(user.publishedDates.slice(0, 10).map(kv => fillBadge(kv, 'warning')).join(' '));
}

function fillBadge(kv, color) {
    let content = kv.value + (kv.count > 1 ? (' | ' + kv.count) : '');
    return `<span class="badge badge-pill badge-${color}">${content}</span>`
}

function connectionErrorMessage() {
    search.connectionOk().then(ok => {
        let searchForm = $('#search-bar').find('form');
        let errorBar = $('#error-bar');
        errorBar.collapse(ok ? 'hide' : 'show');
        searchForm.find(':input').prop('disabled', !ok);
    });
    setTimeout(connectionErrorMessage, 10000)
}
