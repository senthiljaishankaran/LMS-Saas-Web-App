import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import validator from "validator";

/* 
there are two method to validate the email
1. using the regexp(reguar expression)
    const email:RegExp=/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

2. using the package called validator
    npm install validator
*/

// const email:RegExp=/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

// This interface defines the user data strucutre in the database mongoose
// userstructure extends the Document from mongoose
// This interface helps TypeScript provide type-checking and code assistance, 
// making your code more robust and less error-prone
interface UserStructure extends Document{
    name:string
    email:string
    password:string
    avatar:{
        image_id:string,
        url:string
    }
    role:string
    isVerfifed:boolean
    // here the course is an array consisting courses identified by course id
    courses:Array<{courseId:string}>
    // this variable returns a promise so we need to treat it as a async func
    comparePassword:(password:string)=>Promise<boolean>
}

// creating a user schema using UserStrucutre interface
const userSchema:Schema<UserStructure>=new mongoose.Schema(
    {
        name:{
            // here the 'String' is an object of instance String Constructor
            // where 'string' is a normal datatype assigned to variable
            // here since the type refers to the value of property in the 
            // userstructure its type is of String Object
            type:String,
            required:[true,"Please Enter Your Name"]
        },
        email:{
            type:String,
            required:[true,'Please Enter Your Email'],
            validate:(emailValidate:string)=>{
                if(validator.isEmail(emailValidate)){
                    message:"Valid email address"
                    console.log("Valid email address")
                }
                else{
                    message:"Invalid email address"
                    console.log("Invalid email address")
                }
            },
            unique:true
        },
        password:{
            type:String,
            required:[true,"Please Enter Your Password"],
            minlength:[6,"password must have atleast six characters"],
            // the select false property is used to exclude the password 
            // being queried while we try to query the database for data
            select:false
        },   
        avatar:{
            image_id:String,
            url:String,
        },
        role:{
            type:String,
            default:'user'
        },
        isVerfifed:{
            type:Boolean,
            default:false,
        },
        courses:[
            {
                courseId:String
            }
        ],
    },{timestamps:true}
)

// hashing the password before saving it in the database
// pre is method in the schema of mongoose to write a function 
// that needs to happen before save action specified in its method 
userSchema.pre<UserStructure>("save",async function (next) {
  if(!this.isModified('password')){
    next()
  }
  else{
    // here the number 10 specifies cost factor or number of rounds of hashing need to done
    this.password=await bcrypt.hash(this.password,10)
  }  
})

// comparing the password that is hashed in db with the one the user enter
// we need to use the bcrypt compare method as the database password is 
// hashed it will not be same as the password we entered as we dont hash it
// that method will hash the password we enterd and compare them to authenticate the user

// Use method if you want to add an instance method to a specific document instance.
// Use methods if you want to add an instance method to all documents created from a particular model.

// here we used methods because we want use these instance to all users created using this model
// before we made the comparepassword variable to return a promise 
// so now we are using it with the methods to comparePasswords
// we cannot access the comparePassword async function directly using
// userSchema or any other methods under userSchema
// it can only be accessed using the methods function of userSchema
userSchema.methods.comparePassword =async function (enteredPassword:string):Promise<boolean> {
    return await bcrypt.compare(enteredPassword,this.password)
}

// here we create a userModel of type Model from Mongoose
// giving the structure ie.userStructure based on that strucutre the model is created
// userSchema provides rules of validation on the data provided for that structure
const userModel:Model<UserStructure>=mongoose.model("User",userSchema)

export default userModel

/*
Schema:
    A schema in Mongoose defines the structure of the documents (data) that will be stored in a MongoDB collection. 
    It specifies the fields, types, and validation rules for the data.

Model:
    A model in Mongoose is a compiled version of a schema
    Models are used to interact with MongoDB collections. 
    They provide methods for querying, creating, updating, and deleting documents through constructor function.
*/