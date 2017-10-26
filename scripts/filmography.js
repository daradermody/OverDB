/*jslint devel: true, browser: true */
/*global $, define */
"use strict";

define(["./wikipediaApi", "./requests"], function (wikipediaApi, requests) {
    return {

        getFilmography: function (actor) {
            var pageId = wikipediaApi.getIdOfPage(actor);
            console.debug("ID of page: " + pageId);

            var sectionId = wikipediaApi.getSectionIdOfPage(pageId, "Filmography");
            console.debug("Filmography section ID: " + sectionId);

            var films = this.getFilmsInSection(pageId, sectionId);
            console.debug("Films: " + films);

            var content = "";
            for (var i in films) {
                content += `
                        <div class="card">
                          <img class="card-img-top img-fluid" src="images/film.png" alt="Card image cap">
                            <div class="card-block">
                                <div class="card-body">
                                    <h4 class="card-title">` + films[i] + `</h4>
                                    <p class="card-text">It's a movie about cancer.</p>
                                </div>
                            </div>
                        </div>
                    `;

            }
            document.getElementById("resultContent").innerHTML = content;
        },

        getFilmsInSection: function (pageId, sectionId) {
            var response = requests.get("https://en.wikipedia.org/w/api.php?action=parse&pageid=" + pageId + "&section=" + sectionId + "&prop=links&format=json");
            console.debug("Response from get for getFilmsInSection: " + JSON.stringify(response, null, 4));
            var films = [];
            for (var i in response.parse.links) {
                films.push(response.parse.links[i]["*"]);
            }
            return films
        }

    }
});
