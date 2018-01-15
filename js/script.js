
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ", " + city;

    $greeting.text("So you want to live at " + address + " ?");

    var streetviewURL = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + address + " ";
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');
    // dont know from where should iget this url
    var nyTimesURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + city + "&sort=newest&api-key=f2aa44fd8a104b63906ceb0a009c30e5";
    
    $.getJSON(nyTimesURL, function(data) {
        $nytHeaderElem.text("New York Times Articles About " + city);
        var articles = data.response.docs;
        for (var i = 0; i < articles.length; i++){
            var article = articles[i];
            $nytElem.append('<li class="article">'+
            '<a href="'+articles.web_url+'">'+article.headline.main+'</a>'
            +'<p>'+article.snippet+'</p>'+'</li>');
        };
    }).fail(function(){
        $('.nytimes-container').html("<h1>New York Times Articles Could Not Be Loaded</h1>");
    });
    // if there is an error, this will run after 8 seconds(8000 ms)
    var wikiTimeOut = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + city + "&format=json&callback=wikiCallbacl";
    $.ajax(wikiURL, {
        dataType : "jsonp",
        success : function(response){
            var articles = response[1];
            for (var i = 0; i < articles.length; i++){
                var article = articles[i];
                var url = "https://en.wikipedia.org/wiki/" + article;
                $wikiElem.append('<li>'+'<a href="'+url+'">'+city+'</a>'+'</li>');
            }
            // with jsonp, we can't use .fail/.error so we use setTimeout, if ajax
            // works fine, this line will stop setTimeOut from working.
            clearTimeout(wikiTimeOut);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
