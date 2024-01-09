import 'dotenv/config'
import nodemailer,{ Transporter } from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
import env from '../util/validateEnv'

// creating the interface for the item that are required to send an email
interface EmailRequirements{
    // this email refers to the TO emailaddress
    email:string,
    // represents the subject of the mail
    subject:string,
    // Contains the template of an html to render the email format
    template:string,
    // data that will have actual user details that will be inserted to the template at fly
    // that might represent the user's Name
    data:{[key:string]:any}
}

// creating the send mail function that is an async function which will be of type interface EmailRequirements
// it will return the promise which is of type void
const sendMail=async(options:EmailRequirements):Promise<void> =>{
    // transporter acts as a bridge between your application and the email server, handling the process of sending emails
    // transporter is created using the createTransport method

    const transporter:Transporter=nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        service:env.SMTP_SERVICE,
        auth: {
          user: env.SMTP_MAIL,
          pass: env.SMTP_PASSWORD,
        },
      });
    
    // creating input param for async sendMail function 
    const {email,subject,template,data}=options
    
    // defining the path for the html template that is going to be the email format rendered at browser
    const templatePath=path.join(__dirname,'../tempate',template)
    
    // render the template using the ejs ie. embedded javascript with template path and the data of the particular user
    const html:string= await ejs.renderFile(templatePath,data)

    // this function defines the final composed mail to be send
    const mailOptions={
        from:env.SMTP_MAIL,
        to:email,
        subject,
        html
    }
    // this send mail method is from tranporter where we will pass the mailOptions as the param
    await transporter.sendMail(mailOptions)
}

export default sendMail