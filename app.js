//REST API -architectural style to design APIs.
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.listen(3000,function(){
  console.log("server started on port 3000");
});

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});

const articleSchema = new mongoose.Schema({
  title: String,
  content:String
});

const Article = mongoose.model("Article",articleSchema);

app.route("/articles")

.get(function(req,res){
  Article.find({},function(err,foundItems){
    if(!err){
      res.send(foundItems);
    }
    else{
      res.send(err);
    }

  });

})
.post(function(req,res){

  const newArticle = new Article({
    title: req.body.title ,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article");
    }
    else{
      res.send(err);
    }
  });

})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles");
    }
    else{
      res.send(err);
    }
  })

});

app.route("/articles/:paramName")
.get(function(req,res){
  let reqTitle = req.params.paramName;
  Article.find({title:reqTitle},function(err,foundItem){
    if(foundItem){
      res.send(foundItem);
    }
    else{
      res.send("No such article");
    }
  });

})
.put(function(req,res){
  let updateTitle = req.params.paramName;
  Article.update(
    { title:updateTitle},
    { title:req.body.title,
      content:req.body.content},{overwrite:true},function(err){
        if(!err){
          res.send("Successfully updated document");
        }
        else{
          res.send(err);
        }
      })

})
.patch(function(req,res){
  let updateTitle = req.params.paramName;
  Article.update(
    {title:updateTitle},
    {$set:req.body},function(err){
        if(!err){
          res.send("Successfully updated document");
        }
        else{
          res.send(err);
        }
      })

})
.delete(function(req,res){
  let updateTitle = req.params.paramName;
  Article.deleteOne({title:updateTitle},function(err){
    if(!err){
      res.send("Successfully deleted corresponding article");
    }
    else{
      res.send(err);
    }
  });

});
