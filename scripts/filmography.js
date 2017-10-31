/*jslint devel: true, browser: true */
/*global $, define */
"use strict";

define(["./requests"], function (requests) {
    return {
        showFilmography: function (actor) {
            require("./requests").get("/actor/" + actor).done(presentFilmography);
        }
    }
});

function presentFilmography(films) {
    var content = "";

    if (films.length == 0) {
        content = "No films in our database!"
    }

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
}
