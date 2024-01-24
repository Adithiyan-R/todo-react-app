const express = require('express');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const port = 3000;
const app = express();

app.use(bodyparser.json());

const UserSchema = new mongoose.Schema({
    name : String,
    username : String,
    password : String,
    todos : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Todo'
        }
    ]
})

const TodoSchema = {
    task : String,
    description : String
}

const User = mongoose.model('User',UserSchema);

const Todo = mongoose.model('Todo',TodoSchema);

mongoose.connect('mongodb+srv://adithiyan:cluster0@cluster0.kz1zuik.mongodb.net/' , { useNewUrlParser : true , useUnifiedTopology : true});

const SECRET_KEY = "secretkey";

function authenticateJwt(req,res,next){
    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];
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

    const todo = await Todo.create(req.body);

    const todo_id = todo._id;

    const user = await User.findOne({username})

    user.todos.push(todo_id);

    await user.save();

    res.status(201).json({message : "todo added",todo_id});
    
} );

app.put('/update/:id', authenticateJwt, async (req,res) => {

    var todo_id = req.params.id;

    const todos = await Todo.findByIdAndUpdate(todo_id,req.body);
    
    if(todos)
    {
        await todos.save();
        res.json({message : "todo updated"});
    }
    else
    {
        res.status(403).send("wrong todo id");
    }
})

app.delete('/delete/:id', authenticateJwt, async (req,res) => {

    const username = req.user;

    const todo_id = req.params.id;

    const user = await User.findOne({username});

    const userTodos = user.todos;

    console.log(userTodos);

    for(let i=0;i<userTodos.length;i++)
    {
        if(userTodos[i] == todo_id)
        {
            userTodos.splice(i,1);
        }
    }

    user.todos = userTodos;

    console.log(userTodos);

    user.save();

    const todos = await Todo.findByIdAndDelete(todo_id);

    if(todos)
    {
        await todos.save();
        
        res.json({message : "todo deleted"});
    }
    else
    {
        res.status(403).send("wrong todo id");
    }
})

app.get('/', authenticateJwt, async (req,res) =>{

    const username = req.user;

    const users = await User.findOne({username}).populate('todos');

    const todos = users.todos;

    res.json(todos);
})

app.listen(port, () => {
    console.log("listening to port : " + port);
})

