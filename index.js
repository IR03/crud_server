const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

const password = 'p5Dr5AwpEKdPBsT';
const uri = "mongodb+srv://node_practice:p5Dr5AwpEKdPBsT@cluster0.ryify.mongodb.net/node_test?retryWrites=true&w=majority";



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('working');
})


async function run() {
    try {
        await client.connect();
        const databaseName = client.db("node_test");
        const collectionName = databaseName.collection("nodeProducts");

        // create
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await collectionName.insertOne(newUser);
            // console.log("load data from front end", req.body);
            // console.log('added new user', result);
            res.send(result);

        })

        // read
        app.get('/users', async (req, res) => {
            const cursor = collectionName.find({});
            const users = await cursor.toArray();
            res.send(users)
        })

        // delete

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collectionName.deleteOne(query);
            console.log('deleting user with id', result);
            res.json(result);
        })

        // specific data read

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await collectionName.findOne(query);
            console.log('load user with id', id)
            res.send(user)
        })

        // update
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await collectionName.updateOne(filter, updateDoc, options);
            // console.log("identify the id",id);
            // console.log("identify the id", req.body);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => console.log('liistening the port'));