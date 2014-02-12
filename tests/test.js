module('PagedMultiSource', {
    teardown: function() {
        // clean up after each test
        $.mockjaxClear();
    }
});

/**
 * Tests
 */

test('It has a working test harness', function() {
    notEqual(true, false, "We're up and running...");
});

asyncTest("It retrieves a list of REST endpoints", function(){
    // Arrange
    $.mockjax({ url:"/index.php", responseTime: 50,
        responseText:JSON.stringify({ products:[
            {name:"TechTest", "link":"http://randomstorm.dev/JS/server1.php"},
            {name:"TechTest", "link":"http://randomstorm.dev/JS/server2.php"}
        ]})
    });
    var ds = new PagedMultiSource();
    // Act
    ds.getSources("/index.php", function(){
        // Assert
        ok(true, "an ajax call was made");
        equal(ds.sources.length, 2, "a list of endpoints was stored with correct length");
        start();
    });
});
