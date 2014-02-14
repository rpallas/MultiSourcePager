$(document).ready(function(){
    // Apply the knockout bindings
    var multiSource = new PagedMultiSource(),
        vm = new PagedGridVM(multiSource);
    ko.applyBindings(vm, $('.pager').get(0));
});
