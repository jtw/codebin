/* Knockout
***************/
function LastPost(postId, title, createdBy, createdAt) {

	this.postId = postId;
	this.title = title.substring(0, 22);
    this.createdBy = createdBy;
    this.createdAt = createdAt;

}

function LastPostsViewModel() {

	var self =  this;

	self.lastPosts = ko.observableArray([]);

	LastPostsViewModel.initLastPostsWithJSON = function(postsJSON) {

		// Remove all posts
		self.lastPosts.removeAll();

		var posts = JSON.parse(postsJSON);

		self.lastPosts(ko.utils.arrayMap(posts, function(post) {

			var ISODate = post.date.toString(); //2013-03-12T21:43:57.336Z

			var myRegexp = /^(.*)T(.*)\..*/g;
			var match = myRegexp.exec(ISODate);

			var createdAtFormatted = match[1] + " " + match[2];

		    return new LastPost(post._id, post.title, post.author, createdAtFormatted);
		}));
	};
}
ko.applyBindings(LastPostsViewModel(), document.getElementById('last-posts-panel'));


/* Action events
***************/

jQuery("a#send-text").bind("click", function() {

	var username = jQuery("input#username-field").val();
	var title = jQuery("input#title-field").val();
	var clearText = jQuery("textarea#clear-text").val();

	var body = {
		username: username,
		title: title,
		post: clearText
	};

	jQuery.ajax({
        type: "POST",
        url: "/api/posts/new",
        data: body,
        success: function (response) {

            console.log("success");
            fetchLast10Posts();
        },
        error: function (req, status, error) {
            alert("Error: " + error);
        }
    });

});

jQuery("a#preview-text").bind("click", function() {

	var clearTextArea = jQuery("textarea#clear-text");

	insertTextInCodeBlock(clearTextArea.val());
	updateCodeBlock({});

});

jQuery("div#last-posts-panel").on("click", "tr.last-posts-item", function() {
	var postId = jQuery(this).attr('post-id');

	//Change Url
	history.pushState('data', '', '/?id=' + postId);

	loadPostWithId(postId);
});


/* Methods
***************/

function checkQuerystringForId() {

	var params = getUrlVars();

	if(params && params.id) {

		loadPostWithId(params.id);

	}
}

function loadPostWithId(postId) {

	jQuery.ajax({
        type: "GET",
        url: "/api/post/" + postId,
        success: function (postJSON) {

        	var post = JSON.parse(postJSON)[0];

        	insertPost(post.title, post.post);
        	updateCodeBlock({});
            
        },
        error: function (req, status, error) {
            console.log("Error: " + error);
        }
    });

}

function insertPost(title, text) {

	var clearTextBlock = jQuery("textarea#clear-text");
	var titleField = jQuery("input#title-field");

	clearTextBlock.val(text);
	titleField.val(title);

	insertTextInCodeBlock(text);
}

function insertTextInCodeBlock(text) {

	var formattedBlock = jQuery("div#code-block");

	formattedBlock.empty();
	formattedBlock.html('<pre id="formatted-text">' + text + '</pre>');
}

function updateCodeBlock(params) {

	var style = params.style || "random";
	//TODO: check box and calculate current and new
	var box = params.box || "";

	jQuery("pre#formatted-text").snippet("javascript", 
		{
			style: style, 
			box: box,
			clipboard:"content/_snippet/swf/ZeroClipboard.swf"
		});
}

function fetchLast10Posts() {

	jQuery.ajax({
        type: "GET",
        url: "/api/posts/last10",
        success: function (postsJSON) {

        	LastPostsViewModel.initLastPostsWithJSON(postsJSON);
            
        },
        error: function (req, status, error) {
            alert("Error: " + error);
        }
    });

}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$(document).ready(function(){

	checkQuerystringForId();

	//Update Snipped
	updateCodeBlock({});

	fetchLast10Posts();

	$(window).scroll(function(){

		var y = $(window).height() + $(window).scrollTop();
		var target = jQuery('div.clear-text-block');
		var actionFooter= jQuery(".actions");
		
		var bottom = target.position().top + target.height() + 90; //dunno why 90 needed

		if( y >= bottom) {
			actionFooter.removeClass("fixed");
		} else { 
			actionFooter.addClass("fixed");
		}

	});

	//TODO for later
	// $('ol.snippet-num li').click(function(e) {
		
	// 	if(e.offsetX < 0)
	// 	{
	// 		var object = jQuery(this);
	// 		console.log("Clicked " + object.index());
	//         console.log(object.context.innerText);

	//         updateCodeBlock({ box: ""+(object.index() + 1) });
 //    	}
 //     });


});

//Handle tab as indent on the clear-text textbox
$(document).delegate('#clear-text', 'keydown', function(e) { 
  var keyCode = e.keyCode || e.which; 

  if (keyCode == 9) { 
    e.preventDefault(); 
    var start = $(this).get(0).selectionStart;
    var end = $(this).get(0).selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    $(this).val($(this).val().substring(0, start)
                + "\t"
                + $(this).val().substring(end));

    // put caret at right position again
    $(this).get(0).selectionStart = 
    $(this).get(0).selectionEnd = start + 1;
  } 
});
