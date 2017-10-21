/*jslint devel: true, browser: true */
/*global $, define */
"use strict";

define(["./requests"], function (requests) {
    return {
        
        getIdOfPage: function (pageName) {
            console.debug("Getting page ID");
            var response = requests.get("https://en.wikipedia.org/w/api.php?action=query&titles=" + pageName + "&format=json", console.log);
            console.debug("Response from get for getIdOfPage: " + JSON.stringify(response, null, 4));
            return Object.keys(response.query.pages)[0];
        },
        
        getSectionIdOfPage: function (pageId, sectionName) {
            console.debug("Getting section IDs");
            var response = requests.get("https://en.wikipedia.org/w/api.php?action=parse&pageid=" + pageId + "&prop=sections&format=json");
            console.debug("Response from get for getSectionIdOfPage: " + JSON.stringify(response, null, 4));
            return response.parse.sections.find(function (element) {
                return element.line === sectionName;
            }).index;
        }
        
    }
})
