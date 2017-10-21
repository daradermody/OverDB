/*jslint devel: true, browser: true */
/*global $ */
"use strict";

function getFilmography(actor) {
    var pageId = getIdOfPage(actor);
    console.debug("ID of page: " + pageId);

    var sectionId = getSectionIdOfPage(pageId, "Filmography");
    console.debug("ID of page: " + sectionId);

    var films = getFilmsInSection(pageId, sectionId);
    console.debug("Films: " + films);

    var content = "";
    for (var i in films) {
        content += `
            <div class="card" style="width: 20rem;">
              <img class="card-img-top" src="images/film-xxl.png" alt="Card image cap">
              <div class="card-body">
                <h4 class="card-title">` + films[i] + `</h4>
                <p class="card-text">It's a movie about cancer.</p>
              </div>
            </div>
        `;
    }
    document.getElementById("mainContentArea").innerHTML = content;
}

function getIdOfPage(pageName) {
    console.debug("Getting page ID");
    var response = get("https://en.wikipedia.org/w/api.php?action=query&titles=" + pageName + "&format=json", console.log);
    console.debug("Response from get for getIdOfPage: " + JSON.stringify(response, null, 4));
    return Object.keys(response.query.pages)[0];
}

function getSectionIdOfPage(pageId, sectionName) {
    console.debug("Getting section IDs");
    var response = get("https://en.wikipedia.org/w/api.php?action=parse&pageid=" + pageId + "&prop=sections&format=json");
    console.debug("Response from get for getSectionIdOfPage: " + JSON.stringify(response, null, 4));
    return response.parse.sections.find(function(element) {return element.line === sectionName; }).index;
}

function getFilmsInSection(pageId, sectionId) {
    var response = get("https://en.wikipedia.org/w/api.php?action=parse&pageid=" + pageId + "&section=" + sectionId + "&prop=links&format=json");
    console.debug("Response from get for getFilmsInSection: " + JSON.stringify(response, null, 4));
    var films = [];
    console.debug(response.parse.links.values);
    for (var i in response.parse.links) {
        films.push(response.parse.links[i]["*"]);
    }
    return films


//    link["*"] for link in response.json()["parse"]["links"]
}

function get(url) {
    url = 'https://cors-anywhere.herokuapp.com/' + url;

    var response = $.ajax({
        "async": false,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
        }
    });
    console.debug("Response from HTTP request: " + JSON.stringify(response.responseJSON, null, 4));
    return response.responseJSON;
}

function next(iterable) {
    for (var index = 0; index < iterable.length; ++index) {
        if (iterable[index]) return true;
    }
    return false;
}
