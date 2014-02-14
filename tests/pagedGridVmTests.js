module('PagedGridVm');

/**
 * Tests
 */

test("It initialises correctly", function() {
    var // Arrange
        multiSourceStub = stubMultiSource(),
        // Act
        vm = new PagedGridVM(multiSourceStub);
    // Assert
    deepEqual(vm.items(), _.values(multiSourceStub.records), "The items observable was updated correctly");
    equal(vm.totalItems(), multiSourceStub.totalRecords, "The totalRecords observable was updated correctly");
});

test("It can move to a given page", function(){
    var // Arrange
        multiSourceStub = stubMultiSource(),
        vm = new PagedGridVM(multiSourceStub);
    // Act
    vm.goToPage(3);
    // Assert
    deepEqual(vm.items(), _.values(multiSourceStub.records), "The items observable was updated correctly");
});

/**
 * Utilities
 */

function stubMultiSource(){
    var fakeRecords = [];
    for (var i=0; i<50; i++) { fakeRecords.push(i); }
    return {
        records: fakeRecords,
        totalRecords: 100,
        getSources: function(){ return $.when(); },
        goToPage: function(){ return $.when(); }
    };
}