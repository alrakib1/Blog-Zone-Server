const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;

// environment variables
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Blog Zone Server is Running");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://abdullahalrakib30:DlmlfbZ7Rh9nrNJ0@cluster0.fesbo2h.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    app.get("/", (req, res) => {
      res.send("Blog Zone Server is Running");
    });

    const blogsCollection = client.db("Blogs").collection("allBlogs");
    const CommentsCollection = client.db("Blogs").collection("comments");

    // const bookingCollection = client.db("Blogs").collection("bookings");

    //  blogs related api
    app.post("/all", async (req, res) => {
      const blog = req.body;
      const result = await blogsCollection.insertOne(blog);
      res.send(result);
    });

    app.get("/all", async (req, res) => {
      const cursor = blogsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/blogsCount", async (req, res) => {
      const count = await blogsCollection.estimatedDocumentCount();
      res.send({ count });
    });

    app.get("/all/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogsCollection.findOne(query);
      res.send(result);
    });

    app.put("/all/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBlog = req.body;
      const blog = {
        $set: {
          title: updatedBlog.title,
          photoUrl: updatedBlog.photoUrl,
          category: updatedBlog.category,
          shortDescription: updatedBlog.shortDescription,
          longDescription: updatedBlog.longDescription,
        },
      };
      const result = await blogsCollection.updateOne(query, blog, options);
      res.send(result);
    });


    //  comments related api

    app.post('/comments',async(req,res)=>{
      const comment = req.body;
      const result = await CommentsCollection.insertOne(comment);
      res.send(result)
    })

    app.get('/comments', async(req,res)=>{
      const cursor = CommentsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })



    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server running on", port);
});
