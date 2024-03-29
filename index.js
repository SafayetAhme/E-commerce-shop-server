const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.BD_USER)

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.jfiige1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const menusCollection = client.db("E-commerce-Shop").collection("menus");
    const blogsCollection = client.db("E-commerce-Shop").collection("blogs");
    const addtocardCollection = client.db("E-commerce-Shop").collection("additems");

    // get menus api
    app.get('/menus', async (req, res) => {
      const result = await menusCollection.find().toArray();
      res.send(result);
    })

    // get blogs api
    app.get('/blogs', async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result);
    })

    // add to cart post
    app.post('/addtocart', async (req, res) => {
      const addtocart = req.body;
      console.log(addtocart)
      const result = await addtocardCollection.insertOne(addtocart);
      res.send(result);
    })

    // add to cart get api
    app.get('/addtocart', async (req, res) => {
      // const email = req.query.email;
      // const query = { email: email };
      const result = await addtocardCollection.find().toArray();
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('e-commerce-shop is running')
})

app.listen(port, () => {
  console.log(`realestate server is running on port ${port}`)
})