const express=require('express')
const dotenv=require('dotenv')
dotenv.config({path: __dirname + '/.env'}); 
const cors=require('cors')
const app=express();
const connectDb=require('./db/connect')
const userRoutes=require('./Routes/userRoutes')
const chatRoutes=require('./Routes/chatRoutes')
const messageRoutes=require('./Routes/messageRoutes')


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors({ origin: true, credentials: true }));


connectDb();
app.get("/", (req, res) => {
    res.send("API is running123");
  });

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);
    
const port=process.env.PORT

app.listen(port,()=>console.log(`app is running on port ${port}`))
