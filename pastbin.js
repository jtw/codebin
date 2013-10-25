var express = require('express');
var mongoose = require('mongoose');

var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test4');

mongoose.connection.on("open", function(){

	//Delete all post language and create new

	var PostLanguage = require('./models/postLanguage.js');

	//Delete degault post languages
	PostLanguage.remove({}, function(err) {

	   console.log('PostLanguages removed');

	   PostLanguage.findOne({}, function (error, postLanguage){
	  
		  	// If no post languages where found, create all
	  		if(error || !postLanguage) {
				console.log("Inserting new poast languages");

	  			var languages = [
		  							{name: "C", 					code: "c"},
									{name: "C++", 					code: "cpp"},
									{name: "C#", 					code: "csharp"},
									{name: "CSS", 					code: "css"},
									{name: "Flex", 					code: "flex"},
									{name: "HTML", 					code: "html"},
									{name: "Java", 					code: "java"},
									{name: "JavaScript", 			code: "javascript"},
									{name: "JavaScript with DOM", 	code: "javascript_dom"},
									{name: "Perl", 					code: "perl"},
									{name: "PHP", 					code: "php"},
									{name: "Python", 				code: "python"},
									{name: "Ruby", 					code: "ruby"},
									{name: "SQL", 					code: "sql"},
									{name: "XML", 					code: "xml"}
								];

				PostLanguage.create(languages, function (err, languages) {

				    if (err) {
				    	console.log("Could not create default language: " + err);
				    }

				});

	  		}
		});
	});

});

//config
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
   console.log('development');
});

app.configure('production', function(){
  console.log('production');
});

//Views
app.use(express.static(__dirname + '/views'));

var api = require('./controllers/api.js');

app.get('/api/post/:postId', api.getPostWithId);
app.get('/api/posts/all', api.allPosts);
app.post('/api/posts/new', api.newPost);
app.get('/api/posts/last10', api.last10posts);

app.get('/api/postLanguages/all', api.allPostLanguages);

app.listen(8300);
console.log("Express server listening on port 8300");