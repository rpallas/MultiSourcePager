/**
 * A Knockout view model to store state and logic for the grid view
 * @param multiSource The service used for retrieving data from multiple api sources
 * @return {*}
 * @constructor
 */
var PagedGridVM = function(multiSource) {
    var self = this;

    self.items = ko.observableArray([]);
    self.totalItems = ko.observable(0);
    self.currentPageIndex = ko.observable(0);
    self.pageSize = 25;
    self.columns = [
        { headerText: "Name", rowText: "name" },
        { headerText: "Date", rowText: "date" }
    ];

    /**
     * Initialise the VM by discovering the api service endpoints
     */
    self.init = function(){
        multiSource.getSources("/JS/index.php").done(function(){
            self.goToPage(0);
        });
    };

    /**
     * Retrieves data from the multiSource for the given page and updates the UI
     * @param page The page number to go to
     */
    self.goToPage = function(page){
        multiSource.goToPage(page).done(function(){
            self.items(_.values(multiSource.records));
            self.totalItems(multiSource.totalRecords);
            self.currentPageIndex(page);
        });
    };

    /**
     * Calculates the total number of pages across all sources
     */
    self.maxPageIndex = ko.computed(function () {
        return Math.ceil(self.totalItems() / self.pageSize) - 1;
    }, self);

    self.init(); // Kick things off

    return self;
};


