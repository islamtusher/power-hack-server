const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000
require('dotenv').config();

const app = express()
app.use(express.json())
app.use(cors())

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xlljd.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hv5m8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        console.log('Connect With MongoDB');
        const billsCollection = client.db("power-hack").collection("bill-collections");
        const usersCollection = client.db("power-hack").collection("users");
            

        // server home 
        app.get('/', (req, res) => {
            res.send('Auto Menufac server running')
        })

        // load all bill collections data
        app.get('/api/billing-list', async (req, res) => {
            const currentPage = parseInt(req.query.currentPage)
            console.log(currentPage);
            const query = {}
            const cursor =  billsCollection.find(query) 
            if (currentPage >= 0) {
                const result = await cursor.skip(currentPage * 10).limit(10).toArray()
                res.send(result)
            }
        })

        // count all bill collections data
        app.get('/billsCount', async(req, res) => {
            const query = {}
            const cursor =  billsCollection.find(query) 
            const result = await billsCollection.estimatedDocumentCount()
            res.send({result})
        })

        // post a new bill informations
        app.post('/api/add-billing', async (req, res) => {
            const data = req.body
            const result = await billsCollection.insertOne(data)
            res.send(result)
        })
        
        // DElete a new bill informations
        app.delete('/api/delete-billing/:id', async (req, res) => {
            const query = {_id : ObjectId(req.params.id)}
            const result = await billsCollection.deleteOne(query)
            res.send(result)
        })

        // update the odlder one
        app.patch('/api/update-billing/:id', async (req, res) => {
            const filter = {_id : ObjectId(req.params.id)};
            const updateDoc = {
                $set: req.body
            };
            const result = await billsCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        // Post `new user info
        app.post('/api/registration', async (req, res) => {
            const email = req.body.email
            const result = await usersCollection.insertOne(req.body)
            const accessToken = jwt.sign({ email: email}, process.env.ACCESS_TOKEN, { expiresIn: '10d' });
            res.send([result, {accessToken : accessToken}])
        })

        // Post `new user info
        app.get('/api/login', async (req, res) => {
            const email = req.query.email
            const password = req.query.password
            const query = {email : email, password: password}
            const user = await usersCollection.findOne(query)
            if (user) {
                res.status(200).send({ message: 'Login successfull' })
                return
            }
            else {
                return res.status(403).send({message: 'Please Provide Valid Email and Passwoard'})
            } 
        })
         
    }
    finally {
        
    }
}
run().catch(console.dir)


app.listen(port, ()=> {
    console.log('Listing Port', port);
})
