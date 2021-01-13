const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// parsers for data provided from html user
app.use(bodyParser.json());
app.use(bodyParser.text());
const path = require('path');
const http = require('http').Server(app);
const server = require('socket.io')(http);
app.use(express.static(__dirname + '/'));

const db = require('./db');
const { json } = require('express');
const collection = 'questions';

// serve the html file to the user
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

// function to test a user connecting
server.on('connection', function(socket){
    console.log("A user connected");
})

// read all documents from database
app.get('/getQuestions',(req,res)=>{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        // catch errors
        if(err)
            console.log(err);
        else{
            // reverse documents so last entry shown first
            documents.reverse();
            // return to user as json
            res.json(documents);
        }
    })
});

// update documents
app.put('/:id',(req,res)=>{
    // key of question to be updated
    const questionID = req.params.id;
    // variable passed by html on which vote chosen
    const voteType = req.body;
    // find document by ID, increment vote by one
    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(questionID)},
    {$inc : {[voteType] : 1}},{returnOriginal : false},(err,result)=>{
        if(err)
            console.log(err);
        else{
            // return update to user as json
            res.json(result);
        }
    })
});

// create document
app.post('/',(req,res)=>{
    // document to be inserted
    const userInput = req.body;
    // insert document
    db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
        if(err)
            console.log(err);
        else
            // return document to user
            res.json({result : result, document : result.ops[0]});
    });
});

app.delete('/id',(req,res)=>{
    // id of document to be deleted
    const questionID = req.params.id;
    // use findoneanddelete function
    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(questionID)},(err,result)=>{
        if(err)
            console.log(err);
        else
            //return response to user
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

// initialise socket
http.listen(3000, function(){
    console.log('listening on port 3000')
    // connect to database
    db.connect((err)=>{
        if(err){
            console.log('Unable to connect to database');
            process.exit
        }
    })
});