var PagedMultiSource = (function() {
    "use strict";

    var Module = function(limit, offset){
        this.limit = limit || 25;   // Total items in a page
        this.offset = offset || 0;  // the current offset to retrieve from each source
        this.sources = [];          // Storage for the list of api sources
        this.totalRecords = 0;
        this.recordBuffer = [];     // in memory record store
    };

    /**
     * Gets a list of api sources
     * @param url the endpoint used for discovering the api sources
     * @return JQuery Deferred
     */
    Module.prototype.getSources = function(url) {
        var self = this;
        return $.ajax({
            type: "GET",
            url: url
        }).done(function(response){
                self.sources = JSON.parse(response).products;
            });
    };

    /**
     * Gets the next batch of data from each api source
     * @return JQuery Deferred
     */
    Module.prototype.getNext = function(){
        var self = this,
            requests = [],
            nextOffset = self.offset + 1;
        for (var i=0, total=self.sources.length; i<total; i++){
            requests.push($.ajax({
                type: "GET",
                url: self.sources[i].link,
                data: { limit: self.limit, offset: nextOffset }
            }).done(function(response){
                    var data = JSON.parse(response);
                    $.merge(self.recordBuffer, data.data);
                    self.totalRecords += data.total;
                }));
        }
        return $.when.apply($, requests).done(function(){
            self.offset = nextOffset;
        });
    };


    return Module;
}());