/*jslint devel: true, browser: true */
/*global $, define */
"use strict";

define(["./filmography"], function (filmography) {
    $("#searchField").keypress(function (e) {
        if (e.which == 13) {
            filmography.getFilmography(document.getElementById('searchField').value);
            document.getElementById('searchField').value = "Search";
        }
    });

    $("#searchButton").click(function () {
        filmography.getFilmography(document.getElementById('searchField').value);
        document.getElementById('searchField').value = "Search";
    });

});
