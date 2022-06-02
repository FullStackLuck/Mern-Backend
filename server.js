//Import Dependencies
require("dotenv").config()
const express = require ("express");
const app = express();
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require ("mongoose")
const {PORT = 3000, DATABASE_URL } = process.env

//////MODELS/////
const TweetsSchema = new mongoose.Schema(
    {
        name:String,
        tweet:String,
        comment:String,
        image:String
    }
)
const Tweets = mongoose.model("Tweets", TweetsSchema)

//Middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
//Mongoose Connection

mongoose.connect(DATABASE_URL)
// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to MongoDB"))
  .on("close", () => console.log("You are disconnected from MongoDB"))
  .on("error", (error) => console.log(error))


//INDUCES
app.get("/", (req,res)=>{
    res.send("Hello World")
})

//Tweets Index
app.get("/tweets", async (req,res)=>{
    try{
        res.json(await Tweets.find({}))
    } catch (error) {
        res.status(400).json(error)
    }

})

//Create Tweet
app.post("/tweets", async (req,res)=>{
    try{
        res.json(await Tweets.create(req.body))
    } catch (error){
        res.status(400).json(error)
    }
})

//Delete Tweet Route
app.delete("/tweets/:id", async(req,res)=>{
    try{
        req.json(await Tweets.findByIdAndDelete(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
} )

//Update Route
app.put("/tweets/:id", async(req,res)=>{
    try{
        res.json(await Tweets.findByIdAndUpdate(req.params.id, req.body, { new: true})
        )

    } catch(error){
    res.status(400).json(error)
    }
})


//Listen
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})