const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//file import
const userModel = require("./models/userModel");
const { userDataValidate, isEmailValidate } = require("./utils/authUtil");
const isAuth = require("./middlewares/isAuthMiddleware");
const todoDataValidation = require("./utils/todoUtils");
const todoModel = require("./models/todoModel");

//constants
const app = express();
const PORT = process.env.PORT || 8000;
const store = new mongodbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));


//middleware
app.set("view engine", "ejs"); //Set EJS as the template engine in express.
app.use(express.urlencoded({ extended: true })); //form body parser
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static("public")); // Inbuilt middleware to serve static files (CSS, JS, images) from the 'public' directory

//API's
app.get("/", (req, res) => {
  return res.send("server is up and running");
});

app.get("/signup", (req, res) => {
  return res.render("signUpPage");
});

app.post("/signup", async (req, res) => {
  //console.log(req.body);

  const { name, email, username, password } = req.body;

  //data validation
  try {
    await userDataValidate({ name, username, email, password });
  } catch (err) {
    return res.status(400).json(err);
  }

  try {
    // Validate unique email.
    const userEmailExist = await userModel.findOne({ email });
    if (userEmailExist)
      return res
        .status(400)
        .json(
          "An account with this email already exists. Please use a different email or log in"
        );

    // Validate unique username.
    const existingUsername = await userModel.findOne({ username });
    if (existingUsername)
      return res
        .status(400)
        .json("Username is already taken. Please choose a different one.");

    //Hashing the password
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );
    //console.log("hashedPassword: ", hashedPassword);

    //create user obj
    const userObj = new userModel({
      name,
      email,
      username,
      password: hashedPassword, // encrypted password is saved in DB
    });
    //save userdoc in  DB
    const userDb = await userObj.save();

    return res.redirect("/login");
    // return res.status(201).json({
    //   message: "Sign Up Successfull",
    //   data: userDb,
    // });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
});

app.get("/login", (req, res) => {
  return res.render("loginPage");
});

app.post("/login", async (req, res) => {
  // console.log(req.body);
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.status(400).json({
      success: false,
      message: "Login failed: Both login ID and password are required.",
    });
  }
  try {
    //find user in db with the login ID
    let userDb;
    //Make DB call according to login ID format
    if (isEmailValidate({ key: loginId })) {
      userDb = await userModel.findOne({ email: loginId });
    } else {
      userDb = await userModel.findOne({ username: loginId });
    }
    //console.log("line 122",userDb);

    if (!userDb) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please sign up to create an account.",
      });
    }

    //compare the password
    const isMatched = await bcrypt.compare(password, userDb.password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }
    //session based authentication
    // console.log("session:", req.session);
    req.session.isAuth = true;
    //store user information in session
    req.session.user = {
      userId: userDb._id,
      email: userDb.email,
      username: userDb.username,
    };
    return res.redirect("/dashboard");
    //return res.status(200).json("login successfull");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during login.",
      error: error,
    });
  }
});

app.get("/dashboard", isAuth, (req, res) => {
  return res.render("dashboardPage");
});

// logout
app.post("/logout", isAuth, (req, res) => {
  //console.log("line169",req.session.id);

  // Destroy the session
  req.session.destroy((error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Logout unsuccessful. Please try again.",
      });
    }

    // Redirect to login page after successful logout
    return res.redirect("/login");
  });
});

//Logout from all devices
app.post("/logout-from-all", isAuth, async (req, res) => {
  //console.log("line188",req.body);
  // console.log("line 189", req.session.user.username);
  const username = req.session.user.username;

  //create session Schema
  const sessionSchema = new mongoose.Schema({ _id: String }, { strict: false });
  //console.log("194", sessionSchema);

  //convert into session model
  //const sessionModel = mongoose.model("session",sessionSchema); // getting OverwriteModelError

  // Convert into model with overwrite check
  const sessionModel =
    mongoose.models.session || mongoose.model("session", sessionSchema); //Check for existing session model before defining it again.
  //console.log("line199", sessionModel);

  // DB query to delete sessions
  try {
    const deleteDb = await sessionModel.deleteMany({
      "session.user.username": username,
    }); // session.user.username won't work, thats why made it into string
    //console.log("line206 deleteDb:" , deleteDb);

    // Redirect after successful logout
    return res.redirect("/login");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while logging out from all devices. Please try again later.",
      error: error.message || "ERROR",
    });
  }
});

//todo's Api

//create todo
app.post("/create-item", isAuth, async (req, res) => {
  //console.log("line223",req.session.user.username);
  //console.log("line224",req.body.todo);
  const username = req.session.user.username;
  const { todo } = req.body;

  // Data validation for todo
  try {
    await todoDataValidation({ todo });
  } catch (error) {
    return res.send({
      status: 400,
      //message: "Todo validation failed. Please check the todo and try again.",
      //error: error,
      message:error,
    });
  }

  // create todo Obj and save it in DB
  const todoObj = new todoModel({ todo, username });
  //console.log("line241", todoObj);

  try {
    const todoDb = await todoObj.save();
    //console.log("line245", todoDb);

    return res.send({
      status: 201,
      message: "Todo created successfully!",
      data: todoDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message:
        "An error occurred while creating the todo. Please try again later.",
      error: error,
    });
  }
});

// Retrieve todos for the authenticated user
app.get("/read-item", isAuth, async (req, res) => {
  const username = req.session.user.username;
  // Find todos in the database for the specified username
  try {
    const todoDb = await todoModel.find({ username });
    //console.log("line269,", todoDb);
    
     // Check if no todos exist for the user
   if(todoDb.length === 0){
    return res.send({
      status:204,
      message: "No todos found. You're all caught up! Enjoy your day!",
    })
   }
    return res.send({
      status: 200,
      message: "Todos retrieved successfully.",
      data: todoDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message:
        "An error occurred while retrieving todos. Please try again later.",
      error: error.message || "Internal Server Error",
    });
  }
});


//Edit todos
app.post("/edit-item", isAuth, async (req, res) => {
  //console.log("line285", req.body);
  const { todoId, newTodo } = req.body;
  const username = req.session.user.username;
  // Data validation for todo
  try {
    await todoDataValidation({ todo: newTodo });
  } catch (error) {
   // console.log("line292", error);
    return res.send({
      status: 400,
     //message: "Todo validation failed. Please check the todo and try again.",
     // error: error,
     message:error,
    });
  }

  try {
  // Check if the user owns the todo
    const todoDb = await todoModel.findOne({ _id: todoId });
    //console.log("line314",todoDb)
    if (todoDb.username !== username) {
      return res.send({
        status: 403,
        message: "Unauthorized: You do not have permission to edit this todo.",
      });
    }

    // Update the todo in the database
    const newTodoDb = await todoModel.findOneAndUpdate(
      { _id: todoId },
      { todo: newTodo },
      { new: true }
    );
   // console.log("line318", newTodoDb);
    return res.send({
      status: 200,
      message: "Todo updated successfully!",
      data: newTodoDb,
    });
  } catch (error) {
   // console.log("line335",error.message)
    return res.send({
      status: 500,
      message:
        "An error occurred while updating the todo. Please try again later.",
      error: error.message || "Internal Server Error",
    });
  }
});


//Delete todos
app.post("/delete-item",isAuth,async(req,res) =>{
 const username = req.session.user.username;
 const todoId = req.body.todoId;
 //console.log("line348",username,todoId);

  try{
     // Check if the user owns the todo
     const todoDb = await todoModel.findOne({_id:todoId});
   //  console.log("line353",todoDb);
     if (todoDb.username !== username) {
      return res.send({
        status: 403,
        message: "Unauthorized: You do not have permission to delete this todo.",
      });
    }

// Delete the todo from the database
 const deletedTodoDb = await todoModel.findOneAndDelete({_id:todoId})
 // await todoModel.deleteOne({_id:todoId})
 return res.send({
  status:200,
  message:"Todo Deleted successfully!",
  data:deletedTodoDb,
})
  }catch(error){
   //console.log("line390",error)
    return res.send({
      status: 500,
      message:
        "An error occurred while Deleting the todo. Please try again later.",
      error: error.message || "Internal Server Error",
    });
  }
});




app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
