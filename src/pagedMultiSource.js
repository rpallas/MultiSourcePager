var PagedMultiSource = (function() {
    "use strict";

    var Module = function(limit){
        var self = this;
        self.limit = limit;     // Total items in a page
        self.sources = [];      // Storage for the list of api sources
        self.totalRecords = 0;
        self.recordBuffer = []; // in memory record store

        /**
         * Gets a list of api sources
         * @param url the endpoint used for discovering the api sources
         */
        self.getSources = function(url) {
            return $.ajax({
                type: "GET",
                url: url
            }).done(function(response){
                self.sources = JSON.parse(response).products;
            });
        };

        /**
         * Gets the next batch of data from each source
         * @return JQuery Deferred
         */
        self.getNext = function(){
            var count = 0, requests = [], records = [];
            for (var i=0, total=self.sources.length; i<total; i++){
                requests.push($.ajax({
                    type: "GET",
                    url: self.sources[i].link,
                    data: { limit: limit }
                }).done(function(response){
                    var data = JSON.parse(response);
                    $.merge(self.recordBuffer, data.data);
                    self.totalRecords += data.total;
                }));
            }
            return $.when.apply($, requests);
        }
    };



    return Module;
}());