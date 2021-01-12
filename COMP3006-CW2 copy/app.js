const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.text());
const path = require('path');
const http = require('http').Server(app);
const server = require('socket.io')(http);
app.use(express.static(__dirname + '/'));

const db = require('./db');
const { json } = require('express');
const collection = 'questions';

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.on('connection', function(socket){
    console.log("A user connected");
})

app.get('/getQuestions',(req,res)=>{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            documents.reverse();
            console.log(documents);
            res.json(documents);
        }
    })
});

app.put('/:id',(req,res)=>{
    const questionID = req.params.id;
    const voteType = req.body;
    console.log('vote is', voteType)
    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(questionID)},
    {$inc : {[voteType] : 1}},{returnOriginal : false},(err,result)=>{
        if(err)
            console.log(err);
        else{
            res.json(result);
        }
    })
});

app.post('/',(req,res)=>{
    const userInput = req.body;
    console.log(userInput);
    db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
        if(err)
            console.log(err);
        else
            res.json({result : result, document : result.ops[0]});
    });
});

app.delete('/id',(req,res)=>{
    const questionID = req.params.id;
    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(questionID)},(err,result)=>{
        if(err)
            console.log(err);
        else
            res.json(result);
    });
});

/* db.connect((err)=>{
    if(err){
        console.log('Unable to connect to database');
        process.exit(1);
    }
    else{
        app.listen(3000, ()=>{
            console.log('Connected to database, app listening on port 3000')
        });
    }
}); */

http.listen(3000, function(){
    console.log('listening on port 3000')
    db.connect((err)=>{
        if(err){
            console.log('Unable to connect to database');
            process.exit
        }
    })
});