import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../util/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import userModel from "../models/user.model";
import jwt, { Secret } from "jsonwebtoken";
import env from "../util/validateEnv";
import ejs from 'ejs'
import path from "path";

// creating an interface for the user registration
interface RegisterUserInterface {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

// creating function for user registration with the help of CatchAsyncError
export const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    // getting the name,email,password from request body
      const { name, email, password } = req.body;

    // creating a email already exiting verification await function
    // this is an await func as it wait till the data is retrived from req.body
      const isEmailExist = await userModel.findOne({ email });

      // condition block to strike an error when an email is already available
      if (email.isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      // registring the user if the email is not already registered
      const user: RegisterUserInterface = {
        name,
        email,
        password,
      };

      // creating the activation token using the user with createAcctivationToken
      const activationToken = createActivationToken(user);

      // getting the activation code 
      const activationCode=activationToken.activationCode

      const userData={user:{name:user.name},activationCode}

      const htmlMailRender= await ejs.renderFile(path.join(__dirname,"../tempate/activationMail.ejs"),userData)

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// creating interface for token activation
interface ActivationTokenInterface {
  token: string;
  activationCode: string;
}

// creating the activation token which requires user as payload 
export const createActivationToken = (user: any): ActivationTokenInterface => {
  
    // generating a random four digit number using Math.floor and random
    // Math.floor() used to round a down to the nearest integer
    // Math.random() returns a random floating-point number between 0 (inclusive) and 1 (exclusive)
    // so using the two methods random number b/t 1000 to 10000 will be generated
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
   
  // creating a token using jwt.sign()
  // jwt.sign() function takes the payload, the secret key, and optional options to generate a signed JWT.
  // sample method ellabration
  // const token = jwt.sign(payload, secretKey, { expiresIn: '1h', algorithm: 'HS256' });
  // payload is an object containing the information you want to include in the JWT. 
  // It could be user-related information, permissions, or any other data you need to carry
  // here in payload we sent the user info with activation code as permission
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    // the secret key here has to be genereated randomly which i have not done here
    // we will try to do it later
    // the point here is once the token is generated the it will be send in each request from the
    // client to server and server responds to the request only if the token send is correct
    // client send the token encrypted in the http request using any encrytion 
    // but the secret key that client and server is having is key to decrypt and encrypt the token
    // the key will be stored in the client side as well as server side
    // the expiry in the sign() method is not applicable to the secret key 
    // it will be there even if the user logout and login again after some time
    // The secret key is typically changed in response to specific security events or as part of a periodic key rotation policy.
    env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};
