/*jslint devel: true, browser: true */
/*global $, define */
"use strict";

define([], function () {
    return {
        get: function (endpoint, callback) {
            var url = "http://localhost:5000" + endpoint
            return $.ajax({
                "url": url,
                "method": "GET",

                "beforeSend": function(){
                    $('#resultContentLoadingBar').css('visibility','visible');
                },
                "complete": function(){
                    $('#resultContentLoadingBar').css('visibility','hidden');
                },
            });
        }
    }
})

