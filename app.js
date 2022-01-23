//jshint esversion:6 

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin_prathamesh:1210Nanu@cluster0.hm590.mongodb.net/todolistDB");

// create schema
const itemsSchema = {
    name: String
};

// create model/collection
const Item = mongoose.model("Item",itemsSchema);


// new documents
const item1 = new Item ({
    name: "Welcome to ToDoList"
});

const item2 = new Item ({
    name: "click + to add a new entry"
});

const item3 = new Item ({
    name: "<-- uncheck to delete the entry "
});

const defaultArray = [item1,item2,item3];


// create custom list schema
const listSchema = {
    name: String,
    items: [itemsSchema]
};

// create custom list model
const List = mongoose.model("List",listSchema);

//insert documents
// Item.insertMany(defaultArray,function(err){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("Successfully inserted.");
//     }
// });


app.set('view engine', 'ejs');

app.get("/", function (req, res) {

    // read the documents
    Item.find({},function(err,foundItems){

        if(foundItems.length === 0){
            //insert documents
            Item.insertMany(defaultArray,function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("Successfully inserted.");
                }
            });
            res.redirect("/");

        } else {
            res.render("list", {
                pageTitle: "Today",
                newItems: foundItems
            });
        }

    });
    
});


app.post("/",function(req,res){
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const newItem = new Item ({
        name: itemName
    });

    if(listName === "Today"){
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName},function(err,foundList){
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

    
    
});

app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName},function(err,foundList){
        if(!err){
            if(!foundList){

                // creates new lists
                const list = new List ({
                    name: customListName,
                    items: defaultArray
                });
                list.save();

                res.redirect("/" + customListName);
            } else {
                // shows existing list
                res.render("list", {
                    pageTitle: foundList.name,
                    newItems: foundList.items
                });
            }
        }
    });

     
});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(err){
                console.log(err);
            } else {
                console.log("Item Deleted from the list.");
                res.redirect("/");
            }
        });

    } else {
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        });   
    }

});


app.listen(process.env.PORT || 3000, function(){
    console.log("server is up and running.");
});
