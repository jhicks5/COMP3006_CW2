const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
// Database name
const dbname = 'cw2-database';
// Database URL
const uri = "mongodb+srv://JHicks:CW2Pass@cluster0.r0mhr.mongodb.net/cw2-database?retryWrites=true&w=majority";
const mongoOptions = {useNewUrlParser : true};

const state = {
    db : null
};

const connect = (cb) =>{
    // if we already have a connection, call cb
    if(state.db)
        cb();
    else{
        // Attempt connention
        MongoClient.connect(uri,mongoOptions,(err,client)=>{
            // If unable to connect pass error to cb
            if(err)
                cb(err);
            // If successful, set db state and call cb
            else{
                state.db = client.db(dbname);
                cb();
            }
        })
    }
}

// returns the object id
const getPrimaryKey = (_id)=>{
    return ObjectID(_id);
}

// returns database connection
const getDB = ()=>{
    return state.db;
}

module.exports = {getDB,connect,getPrimaryKey};