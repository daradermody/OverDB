/*jslint devel: true, browser: true */
/*global $, define */
"use strict";

define(["./filmography"], function (filmography) {
    $("#searchField").keypress(function (e) {
        if (e.which === 13) {
            var input = document.getElementById('searchField').value.trim();
            if (!input) {
                document.getElementById('resultContent').innerHTML = "No search input given"
            } else {
                document.getElementById('resultContent').innerHTML = ""
                document.getElementById('resultTitle').innerHTML = "<p>Showing results for " + input + "</p>";
                filmography.showFilmography(input.toString());
                document.getElementById('searchField').value = "";
            }
        }
    });

    $("#searchButton").click(function () {
        var input = document.getElementById('searchField').value;
        document.getElementById('resultTitle').innerHTML = "<p>Showing results for " + input + "</p>";
        filmography.showFilmography(input.toString());
        document.getElementById('searchField').value = "";
    });

});


