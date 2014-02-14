var multiSource, limit, offset;

module('PagedMultiSource', {
    setup: function() {
        limit = 25; offset = 0;
        multiSource = new PagedMultiSource(limit, offset);
    },
    teardown: function() {
        // clean up after each test
        $.mockjaxClear();
    }
});

/**
 * Tests
 */

test("It initialises correctly", function() {
    equal(multiSource.limit, limit, "The correct limit (pagesize) was set");
    equal(multiSource.offset, offset, "The correct offset was set");
});

asyncTest("It retrieves a list of REST endpoints", function(){
    // Arrange
    ajaxMockIndexWith2Sources();
    ajaxMockAnySourceWithXRecords(10);
    // Act
    multiSource.getSources("/index.php")
        .done(function(){
            // Assert
            equal(multiSource.sources.length, 2, "A list of endpoints was stored with correct length");
            equal(multiSource.totalRecords, 20, "The correct number of total records was calculated");
            start();
        });
});

asyncTest("It correctly maps each page to a server and offset", function(){
    // Arrange
    ajaxMockIndexWith2Sources();
    ajaxMockAnySourceWithXRecords(50); // 4 pages total
    // Act
    multiSource.getSources("/index.php")
        .done(function(){
            // Assert
            equal(multiSource.pageMap.length, 4, "It maps the correct number of pages");
            start();
        });
});

/**
 * Utilities
 */

function ajaxMockIndexWith2Sources(){
    $.mockjax({ url:"/index.php", responseTime: 50, contentType: 'text/json',
        responseText: JSON.stringify({ products: get2Sources() })
    });
}

function ajaxMockAnySourceWithXRecords(X){
    var responseData = {};
    for (var i=0; i<X; i++){
        responseData[i] = {name: "Test data ... " + i, date:"2010-13-01 13:47:04" }
    }
    $.mockjax({
        url:"http://randomstorm.dev/JS/server*",
        responseTime: 50,
        data: { limit: limit },
        contentType: 'text/json',
        responseText:JSON.stringify({"total":X, "offset":0, "limit":25, "data":responseData})
    });
}

function get2Sources(){
    return [
        { name:"TechTest", "link":"http://randomstorm.dev/JS/server1.php" },
        { name:"TechTest", "link":"http://randomstorm.dev/JS/server2.php" }
    ];
}