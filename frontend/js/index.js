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

    let clearHistoryBtn = $('#clear-history-btn');

    // Handle connection issues
    connectionErrorMessage();

    // Hide big header when the search bar is activated
    searchForm.delegate(':input', 'focus', () => $('#header-img').collapse());

    // Handle search events
    searchForm.bind('submit', event => {
        event.preventDefault();
        funcs.handleClick(event.target.query.value);
    });

    clearHistoryBtn.bind('click', event => {
        console.log("Clear history btn clicked.");
        UserService.user.clear();
    })

    // Bind user to user details view
    UserService.user.addListener(showUserDetails)
});

function showUserDetails(user) {
    $('#keywords-list').html('');
    $('#entities-list').html('');
    $('#sources-list').html('');
    $('#authors-list').html('');
    $('#publishedDates-list').html('');
    $('#keywords-list').append(user.keywords.slice(0, 10).map(kv => fillBadge(kv, 'success', user.keywords)));
    $('#entities-list').append(user.entities.slice(0, 10).map(kv => fillBadge(kv, 'info', user.entities)));
    $('#sources-list').append(user.sources.slice(0, 10).map(kv => fillBadge(kv, 'warning', user.sources)));
    $('#authors-list').append(user.authors.slice(0, 10).map(kv => fillBadge(kv, 'primary', user.authors)));
    $('#publishedDates-list').append(user.publishedDates.slice(0, 10).map(kv => fillBadge(kv, 'warning', user.publishedDates)));
}

function fillBadge(kv, color, type) {
    let content = kv.value + (kv.count > 1 ? (' | ' + kv.count) : '');
    return $(`<span role="button" class="badge badge-pill badge-${color}">${content}</span>`).click(() =>
      UserService.user.downVote(kv.value, type)
    );

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
