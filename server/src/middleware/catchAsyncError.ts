import { NextFunction, Request, Response } from "express";

/* 
CatchAsyncError function takes a function asyncFunc as an argument and returns a 
new function that can be used as middleware in an Express.js route handler. 

The purpose of this utility is to simplify error handling in asynchronous route 
handlers by automatically catching and passing errors to the Express.js next function.

Wraps the call to asyncFunc in a Promise.resolve() to ensure that the return value 
is always a Promise.

Uses .catch(next) to catch any errors that might occur during the execution of 
asyncFunc and passes them to the Express.js next function

This code is concise and serves its purpose of simplifying error handling in 
asynchronous route handlers. 

It's a clean and reusable way to handle errors consistently across multiple routes 
without having to write try-catch blocks for each async function.

Note:
    What if the asycnFunc does not return a Promise
    1. if returns a promise it works as expected
    2. if does'nt promise will still treat synchronous error 
        same as the async and it catches the error and pass it to  Express js
*/

export const CatchAsyncError =
  (asyncFunc: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(asyncFunc(res, req, next)).catch(next);
  };

/* 
// Alternate method to handle async function error with try catch block and a separate
// error handler not a concise code but more understandable code then the above one

// Error handler
import { Request, Response, NextFunction } from 'express';

// Async function that simulates fetching data from a database
async function fetchDataFromDatabase(): Promise<string> {
  // Simulating an error for demonstration purposes
  throw new Error('Database error: Unable to fetch data');
  // In a real-world scenario, you would have actual asynchronous operations here
}

// Route handler using the async function
export const getData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Call the async function
    const data = await fetchDataFromDatabase();

    // If successful, send the data in the response
    res.json({ data });
  } catch (error) {
    // If an error occurs, handle it here
    console.error('Error:', error.message);

    // Pass the error to the Express error-handling middleware
    next(error);
  }
};

// Express error-handling middleware
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  res.status(500).json({ error: error.message });
};

*/