/**
 * A data source that supports paging across multiple data sources
 */
var PagedMultiSource = (function() {
    "use strict";

    var MultiSource = function(limit, offset){
        this.limit = limit || 25;   // Total items in a page
        this.offset = offset || 0;  // the current offset to retrieve from each source
        this.sources = [];          // Storage for the list of api sources
        this.totalRecords = 0;
        this.records = [];          // in memory record store
        this.pageMap = [];          // page => { server, offset }
    };

    /**
     * Gets a list of api sources
     * @param url the endpoint used for discovering the api sources
     * @return JQuery Deferred
     */
    MultiSource.prototype.getSources = function(url) {
        var self = this,
            dfd = $.Deferred();
        $.ajax({
            type: "GET",
            url: url
        }).done(function(response){
                self.sources = response.products;
                self.mapPages().done(function(){
                    dfd.resolve();
                });
            });
        return dfd.promise();
    };

    /**
     * Uses the page map to retrieve a specific page from the correct source api
     * @return JQuery Deferred
     */
    MultiSource.prototype.goToPage = function(page){
        var self = this,
            map = self.pageMap[page],
            server = map.server,
            offset = map.offset;
        return $.ajax({
            type: "GET",
            url: server,
            data: { limit: self.limit, offset: offset }
        }).done(function(response){
                self.records = response.data;
            });
    };

    /**
     * Requests the limit from each available source and uses the
     * combined results to calculate the total number of pages and
     * then map each available page to a server and offset
     * @return JQuery Deferred
     */
    MultiSource.prototype.mapPages = function(){
        var self = this, count = 0, requests = [], link= "";
        for (var i=0, total=self.sources.length; i<total; i++){
            link = self.sources[i].link;
            requests.push($.ajax({
                type: "GET",
                url: self.sources[i].link,
                data: { limit: self.limit }
            }).done(function(response){
                    count += response.total;
                    // Map the pages
                    var pageCount = Math.ceil(response.total / self.limit);
                    for(var j=0; j<pageCount; j++){
                        var server = this.url.split("?")[0]; // remove query string from the url
                        self.pageMap.push({server: server, offset: j});
                    }
                }));
        }
        return $.when.apply($, requests).done(function(){
            self.totalRecords = count;
        });
    };

    return MultiSource;
}());