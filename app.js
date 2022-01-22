//jshint esversion:6 

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

let items = ["Breakfast","Code","Sleep"];
let workItems = [];

app.get("/", function (req, res) {

    const day = date.getDay();

    res.render("list", {
        pageTitle: day,
        newItems: items
    });

});

app.post("/",function(req,res){
    const item = req.body.newItem;

    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
    
    
});

app.get("/work",function(req,res){
    res.render("list",{
        pageTitle: "Work List",
        newItems: workItems
    });

});


app.listen(3000, function () {
    console.log("server is up and running on port 3000.");
});