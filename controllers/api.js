var Post = require('../models/post.js');
var PostLanguage = require('../models/postLanguage.js');


exports.allPosts= function(req, res) {
  Post.find(function(err, posts) {
    res.send(posts);
  });
}

exports.allPostLanguages= function(req, res) {
  PostLanguage.find(function(err, postlanguages) {
    res.send(postlanguages);
  });
}


exports.getPostWithId = function(req, res) {
   console.log("param: " + req.params.postId);

   Post.find({ '_id': req.params.postId }, function (error, post) {
    
      if(error) {
    
       console.log("error: " + error);
       res.send(404, "post not found");

      } else {

        res.send(JSON.stringify(post));
        
      }

  }); 
}

exports.newPost = function(req, res) {
   
  console.log("Body: " + JSON.stringify(req.body, null, 2));

  var name = req.body.username || "Anonymous";
  var title = req.body.title || "";
  var post = req.body.post || "";

  new Post({author: name, title: title, post: post}).save(function(error, newPost) {
	
  	if(error) {
  	  
      console.log("error: " + error);

  	} else {

  	  res.send(JSON.stringify(newPost));
      
  	}

  });

}

exports.last10posts= function(req, res) {

  Post.find({

      //deal_id:deal._id // Search Filters
  },
  '_id title date author', // Columns to Return
  {
       sort:
       {
           date: -1 //Sort by Date Added DESC
       },
       limit: 10
  },
  function(err, last10Posts) {
    
      res.send(JSON.stringify(last10Posts)); // Do something with the array of 10 objects
  });

}