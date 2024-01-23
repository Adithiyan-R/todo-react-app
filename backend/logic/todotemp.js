const express = require('express');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const port = 3000;
const app = express();

app.use(bodyparser.json());
app.use(cors());

const UserSchema = new mongoose.Schema({
    name : String,
    username : String,
    password : String,
    todos : Array
})

const User = mongoose.model('User',UserSchema);

mongoose.connect('mongodb+srv://adithiyan:cluster0@cluster0.kz1zuik.mongodb.net/' , { useNewUrlParser : true , useUnifiedTopology : true});

const SECRET_KEY = "secretkey";

function authenticateJwt(req,res,next){
    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];
    if(token!="null")
    {
        const user = jwt.verify(token,SECRET_KEY);
        if(user)
        {
            req.user = user;
            next();
        }
        else
        {
            res.status(401).send("authorization failed");
        }
    }
    else{
        return res.status(403).send("auth failed")
    }
    
}

app.post('/signup', async (req,res) =>{

    var username = req.body.username;

    var present = await User.findOne({username});

    if(present)
    {
        res.status(403).send("username alrady exists");
    }
    else
    {
        const user = new User(req.body);
        await user.save();

        const token = jwt.sign(username,SECRET_KEY);

        res.status(201).json({message : "user created",token});
    }

})

app.post('/login', async (req,res) =>{

    var username = req.headers.username;
    var password = req.headers.password;

    const verified = await User.findOne({username, password});

    if(verified)
    {
        const token = jwt.sign(username,SECRET_KEY);

        res.json({message : "user logged in successfully",token});
    }
    else
    {
        res.status(403).send("login failed");
    }
})

app.get('/logout', authenticateJwt, (req,res) => {
    res.send("user logged out");
})

app.post('/add', authenticateJwt, async (req,res) =>{

    const username = req.user;

    const user = await User.findOne({username});

    var length = user.todos.length;

    const newTodo = {
        id : length+1,
        task : req.body.task,
        description : req.body.description
    }

    user.todos.push(newTodo);

    await user.save();

    res.status(201).json({message : "todo added"});
} );

app.put('/update/:id', authenticateJwt, async (req,res) => {

    var username = req.user;

    var todo_id = req.params.id;

    const user = await User.findOne({username});

    const userTodos = user.todos;

    let flag = 0;

    for(let i=0;i<userTodos.length;i++)
    {
        if(userTodos[i].id == todo_id)
        {
            flag=1;
            userTodos[i].task = req.body.task;
            userTodos[i].description = req.body.description;
        }
    }

    const updatedUser = await User.findOneAndUpdate({username},{todos : userTodos},{new : true});

    await updatedUser.save();
    
    if(flag==1)
    {
        res.json({message : "todo updated"});
    }
    else
    {
        res.status(403).send("wrong todo id");
    }
})

app.delete('/delete/:id', authenticateJwt, async (req,res) => {

    var username = req.user;

    var todo_id = req.params.id;

    const user = await User.findOne({username});

    const userTodos = user.todos;

    let flag = 0;

    for(let i=0;i<userTodos.length;i++)
    {
        if(userTodos[i].id == todo_id)
        {
            flag=1;
            userTodos.splice(i,1);
        }
    }

    const updatedUser = await User.findOneAndUpdate({username},{todos : userTodos},{new : true});

    await updatedUser.save();
    
    if(flag==1)
    {
        res.json({message : "todo deleted"});
    }
    else
    {
        res.status(403).send("wrong todo id");
    }
    
})

app.get('/', authenticateJwt, async (req,res) =>{
    const username = req.user;
    const user = await User.findOne({username});
    
    var current_user_todos = user.todos;

    res.json(current_user_todos);
})

app.listen(port, () => {
    console.log("listening to port " + port);
})

