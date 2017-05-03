const search = require('./search');
const $ = require('jquery');
import {ElasticUser} from "./user";

export function handleClick(queryTerm) {
    if (queryTerm === "") {
        alert("Search for something...");
    }
    else {
        if (checkUserExist())
        {
            var user = getUser();
            search.search(queryTerm, user)
                .then(results => replaceResults(results, $('#results .row')));
        }else{
            var user = new ElasticUser();
            setUser(user);
            search.search(queryTerm, user)
                .then(results => replaceResults(results, $('#results .row')));
        }
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

function setUser(User) {
    //var d = new Date();
    //d.setTime(d.getTime() + exdays*24*60*60*1000);
    //var expires = "expires=" + d.toGMTString();

    // Can only set one key-value pair at time! https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#Syntax
    // Must use 127.0.0.1, because chrome denies cookie when using file://
    // When expires = 0 or omitted, the cookie is only valid in one session

    document.cookie = "keywords=" + JSON.stringify(User.keywords);
    document.cookie = "entities=" + JSON.stringify(User.entities);
    document.cookie = "authors=" + JSON.stringify(User.authors);
    document.cookie = "sources=" + JSON.stringify(User.sources); 
    console.log("New cookie created\n" + document.cookie);
}

function getUser(){
    var user = new ElasticUser();
    user.keywords = JSON.parse(getCookie("keywords"));
    user.entities = JSON.parse(getCookie("entities"));
    user.authors = JSON.parse(getCookie("authors"));
    user.sources = JSON.parse(getCookie("sources"));
    return user;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkUserExist() {
    var exist = getCookie("keywords");
    if (!exist) {
        console.log("No cookie detected");
        return false;
    } else {
        console.log("Cookie exist");
        return true;
    }
}
