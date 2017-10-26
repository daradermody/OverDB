/*jslint devel: true, browser: true */
/*global $, define */
"use strict";

define([], function () {
    return {
        get: function (url) {
            url = 'https://cors-anywhere.herokuapp.com/' + url;
            var response = $.ajax({
                "async": false,
                "crossDomain": true,
                "url": url,
                "method": "GET",
                "headers": {
                    "cache-control": "no-cache",
                },
                "beforeSend": function(){
                    $('#resultContentLoadingBar').css('visibility','visible');
                },
                "complete": function(){
                    $('#resultContentLoadingBar').css('visibility','hidden');
                },
                "success": function(){
                    //I'm really not sure what should be here...
                }
            });
            return response.responseJSON;
        }
    }
})

