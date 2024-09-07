const express=require('express')
const cors=require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
const app=express()

const port=process.env.PORT|| 4000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vmhty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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

    const placesCollection =client.db('PlacesData').collection('places')


    app.get('/',(req,res)=>{
        res.send('This is server site homepage')
    })

app.get('/countries',async(req,res)=>{
    const cursor=placesCollection.find();
    const result=await cursor.toArray()
    res.send(result)
})
 
app.get('/countries/:id',async(req,res)=>{
  const id =req.params.id ;
  const query={_id:new ObjectId(id)} 
  const result=await placesCollection.findOne(query)
  res.send(result)
})
// -----------------get by email------------------------
app.get("/myList/:email",async(req,res)=>{
  // console.log(req.params.email)
  const result=await placesCollection.find({email:req.params.email}).toArray();
  res.send(result)
})
// -------------------get by country name------------
app.get("/country/:countryName",async(req,res)=>{
     console.log(req.params.countryName)
     const result=await placesCollection.find({countryName:req.params.countryName}).toArray();
     res.send(result)
})
// --------------

// ---------------- post country data--------------------
  app.post('/countries',async(req,res)=>{
    const country=req.body;
    console.log(country)
    const result=await placesCollection.insertOne(country)
    res.send(result)
  })

  // --------------update server data ------------------
   app.get('/countries/:id',async(req,res)=>{
    const id=req.params.id ;
    const query={_id:new ObjectId(id)}
    const result=await placesCollection.findOne(query)
     res.send(result)
   })  
   
   app.put('/countries/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)};
    const options = { upsert: true };
    const updatePlace=req.body;
    const updateDoc = {
      $set:{
        imageUrl:updatePlace.imageUrl,
        userName:updatePlace.userName,
        spotsName:updatePlace.spotsName,
        email:updatePlace.email,
        countryName:updatePlace.countryName,
        location:updatePlace.location,
        description:updatePlace.description,
        averageCost:updatePlace.averageCost,
        seasonality:updatePlace.seasonality,
        travelTime:updatePlace.travelTime,
        totalVisitorPerYear:updatePlace.totalVisitorPerYear
      }
    }
    const result=await placesCollection.updateOne(query,updateDoc,options);
    res.send(result)
   })

  // --------------delete button ------------------
  app.delete('/countries/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)}
    const result=await placesCollection.deleteOne(query)
    res.send(result)
  } )
  // ---------------------------------------------

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// -------------------------------------------------------
app.listen(port,()=>{
    console.log(`the running server is ${port}`)
})
