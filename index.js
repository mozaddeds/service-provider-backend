const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 4000;
const cors = require('cors');


const { response } = require('express');

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({extended:false}))

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.txt18.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {

  const serviceCollection = client.db("serviceproviderdb").collection("services");
  const orderCollection = client.db("serviceproviderdb").collection("orders");
  const adminCollection = client.db("serviceproviderdb").collection("admins");
  const reviewCollection = client.db("serviceproviderdb").collection("review");


  app.post('/addproduct', (req, res) => {

    const newProduct = req.body;

    serviceCollection.insertOne(newProduct)
      .then((result, error) => {
        res.send(result.insertedCount > 0)
      })

  })

  app.get('/allservices', (req, res) => {
    serviceCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.post('/orderedproducts', (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/allorders', (req, res) => {
    orderCollection.find()
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/getorders', (req, res) => {
    orderCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  app.delete('/deleteservice/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    serviceCollection.findOneAndDelete({ _id: id })
      .then(documents => { res.send(!!documents.value) })
  })


  app.post('/addadmin', (req, res) => {

    const newAdminEmail = req.body;

    adminCollection.insertOne(newAdminEmail)
      .then((result, error) => {
        res.send(result.insertedCount > 0)
      })

  })


  app.post('/servicereviews', (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/allreviews', (req, res) => {
    reviewCollection.find()
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  app.post('/isadmin', (req, res) => {
    const email = req.query.email;
    adminCollection.find({ adminEmail: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0);
      })

  })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})