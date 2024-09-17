const express = require('express') 
const mongoose = require('mongoose'); 
require("dotenv").config();

//file import
const userModel = require('./models/userModel');
const { userDataValidate } = require('./utils/authUtil');

//constants
const app = express();
const PORT = process.env.PORT ||8000;

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));


//middleware  

app.set("view engine","ejs"); //Set EJS as the template engine in express.
app.use(express.urlencoded({extended : true}))       //form body parser
app.use(express.json());


//API's
app.get("/",(req,res)=>{  
    return res.send("server is up and running");
})

app.get("/signup",(req,res)=>{  
    return res.render("signUpPage");
})

app.post("/signup",async (req,res)=>{  
   console.log(req.body);

   const {name,email,username,password} = req.body;
     
   //data validation
   try{
    await userDataValidate({name,username,email,password});
   }catch(err){
    return res.status(400).json(err);
   }

   //create user obj
   const userObj = new userModel({
    name,email,username,password,
   })


   //save userdoc in  DB
   try{
    const userDb = await userObj.save();

    return res.status(201).json({
        message:"Sign Up Successfull",
        data:userDb,
    });

   }catch(error){
    return res.status(500).json({
        message:"Internal server error",
        error:error,
    })

   }
})


app.get("/login",(req,res)=>{  
    return res.render("loginPage");
})

app.post("/login",(req,res)=>{  
    return res.json("login successfull");
})



app.listen(PORT,()=>{
    console.log(`server is running at http://locahost:${PORT}`);

});
