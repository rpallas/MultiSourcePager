var dataSource, limit;

module('PagedMultiSource', {
    setup: function() {
        limit = 25;
        dataSource = new PagedMultiSource(limit);
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

test("It sets the correct limit (pagesize)", function() {
    equal(dataSource.limit, limit, "The correct limit was set");
});

asyncTest("It retrieves a list of REST endpoints", function(){
    // Arrange
    ajaxMockIndexWith2Sources();
    ajaxMockAnySourceWith1Record();
    // Act
    dataSource.getSources("/index.php")
        .done(function(){
            // Assert
            equal(dataSource.sources.length, 2, "a list of endpoints was stored with correct length");
            start();
        });
});

asyncTest("It gets the next batch of records from each source", function(){
    // Arrange
    ajaxMockAnySourceWith1Record();
    dataSource.sources = get2Sources();
    // Act
    dataSource.getNext()
        .done(function(){
            // Assert
            equal(dataSource.totalRecords, 2, "correct number of total records was set");
            equal(dataSource.recordBuffer.length, 2, "The correct number of records was stored in the buffer")
            start();
        });
});

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