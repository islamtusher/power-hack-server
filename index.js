const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000
require('dotenv').config();

const app = express()
app.use(express.json())
app.use(cors())

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xlljd.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const uri = "mongodb+srv://power-hack:tCCTbVgKXjsIs1Hd@cluster0.hv5m8.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        console.log('Connect With MongoDB');
        const billsCollection = client.db("power-hack").collection("bill-collections");
            

        // server home 
        app.get('/', (req, res) => {
            res.send('Auto Menufac server running')
        })

        // load all bill collections data
        app.get('/bills', async(req, res) => {
            const query = {}
            const cursor =  billsCollection.find(query) 
            const result = await cursor.toArray()
            res.send(result)
        })

         
    }
    finally {
        
    }
}
run().catch(console.dir)


app.listen(port, ()=> {
    console.log('Listing Port', port);
})
