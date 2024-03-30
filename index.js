const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwvmezk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });

    const reviewCollection = client.db("shilaFashionDB").collection("reviews");
    const userCollection = client.db("shilaFashionDB").collection("users");
    const cartCollection = client.db("shilaFashionDB").collection("carts");
    const productCollection = client
      .db("shilaFashionDB")
      .collection("products");

    // carts collecion apis route
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/carts", async (req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result);
    });

    // products collecion apis route
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    // review collection apis route
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // users collection apis route
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateOne = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updateOne);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;

      // if user does exists
      const query = { email: user?.email };
      const isExists = await userCollection.findOne(query);
      if (isExists) {
        return res.send({ message: "email already exists", insertedId: null });
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// home route
app.get("/", (req, res) => {
  res.send("shila fashion house - - - server is running....");
});

app.listen(port, () => {
  console.log(`server is running successfully at http://localhost:${port}`);
});
