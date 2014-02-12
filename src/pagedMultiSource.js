var PagedMultiSource = (function() {
    "use strict";

    var Module = function(){
        var self = this;
        self.sources = [];
        self.getSources = function(url, callback) {
            $.ajax({
                type:"GET",
                url:url
            }).done(function(response){
                self.sources = JSON.parse(response).products;
                if (callback) callback();
            });
        };
    };

    return Module;
}());