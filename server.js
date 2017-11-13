var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require("body-parser");
var session = require('express-session');
app.listen(8000, function() {
 console.log("listening on port 8000");
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({secret: 'codingdojorocks'}));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './static')));

mongoose.Promise = global.Promise;

var TaskSchema = new mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String, default:""},
    completed:{type:Boolean, default: false }
},{timestamps:true});

mongoose.model("Task",TaskSchema);
var Task = mongoose.model("Task");

app.get('/tasks', function(req, res){
    Task.find({},function(err, tasks){
        if(err){
            res.send("there is a error!!!");
        }else{
            res.json(tasks);
        }
    })
})


app.post('/tasks', function(req, res){
    console.log(req.body);
    var newTask = new Task({title:req.body.title, description:req.body.description, completed:req.body.completed});
    newTask.save(function(err){
        if(err){
            res.send("there is a error!!!");
        }else{
            res.redirect('/tasks');
        }
    })
})

app.get('/tasks/:id', function(req, res){
    Task.findOne({_id:req.params.id},function(err, task){
        if(err){
            res.send("Can not find this task!!!");
        }else{
            res.json(task);
        }
    })
})

app.put('/tasks/:id', function(req, res){
    Task.findOne({_id:req.params.id},function(err, task){
        if(err){
            res.send("Can not find this task!!!");
        }else{
            task.title = req.body.title;
            task.description = req.body.description;
            task.completed = req.body.completed;
            task.save(function(err){
                if(err){
                    res.send("Can not update this task!!!");
                }else{
                    res.redirect('/tasks');
                }
            })
        }
    })
})

app.delete('/tasks/:id', function(req, res){
    Task.remove({_id:req.params.id},function(err){
        if(err){
            res.send("Can not remove this task!!!");
        }else{
            res.redirect('/');
        }
    })
})