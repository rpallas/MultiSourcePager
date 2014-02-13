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

test("It has a working test harness", function() {
    notEqual(true, false, "We're up and running...");
});

test("It initialises correctly", function() {
    equal(multiSource.limit, limit, "The correct limit (pagesize) was set");
    equal(multiSource.offset, offset, "The correct offset was set");
});

asyncTest("It retrieves a list of REST endpoints", function(){
    // Arrange
    ajaxMockIndexWith2Sources();
    ajaxMockAnySourceWith1Record();
    // Act
    multiSource.getSources("/index.php")
        .done(function(){
            // Assert
            equal(multiSource.sources.length, 2, "A list of endpoints was stored with correct length");
            start();
        });
});

asyncTest("It gets the next batch of records from each source", function(){
    // Arrange
    ajaxMockAnySourceWith1Record();
    multiSource.sources = get2Sources();
    var currentOffset = multiSource.offset;
    // Act
    multiSource.getNext()
        .done(function(){
            // Assert
            equal(multiSource.totalRecords, 2, "The correct number of total records was calculated");
            equal(multiSource.recordBuffer.length, 2, "The records were stored in the buffer");
            equal(multiSource.offset, currentOffset + 1, "The offset was incremented");
            start();
        });
});

//test("It", function(){
//
//});

/**
 * Utilities
 */

function ajaxMockIndexWith2Sources(){
    $.mockjax({ url:"/index.php", responseTime: 50,
        responseText: JSON.stringify({ products: get2Sources() })
    });
}

function ajaxMockAnySourceWith1Record(){
    $.mockjax({ url:"http://randomstorm.dev/JS/server*", responseTime: 50, data: { limit: limit },
        responseText:JSON.stringify({"total":1, "offset":0, "limit":1, "data":[
            {"name":"ET USER_AGENTS suspicious user agent string (changhuatong)", "date":"2013-09-05 23:31:35"}
        ]})
    });
}

function get2Sources(){
    return [
        {name:"TechTest", "link":"http://randomstorm.dev/JS/server1.php"},
        {name:"TechTest", "link":"http://randomstorm.dev/JS/server2.php"}
    ];
}

//function ajaxMockAnySourceWith1Record(){
//    $.mockjax({ url:"http://randomstorm.dev/JS/server*", responseTime: 0, data: { limit: limit },
//        responseText: function(settings){
//            return {"total":1, "offset":0, "limit":1, "data":[
//                {"name":"ET USER_AGENTS suspicious user agent string (changhuatong)", "date":"2013-09-05 23:31:35"}
//            ]};
//        }
//    });
//}