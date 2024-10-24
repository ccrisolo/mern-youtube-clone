//entry point for our api, define or import endpoints from routes/api here, serves data from backend to client(ie frontend)
import express from "express";
import dotenv from "dotenv";
import cors from 'cors' //The CORS (Cross-Origin Resource Sharing) library in Node.js is used to enable cross-origin requests in web applications. It allows your server to handle requests from different origins (domains, protocols, or ports), which are otherwise blocked by browsers due to the same-origin policy for security reasons.
import logger from 'morgan' //The Morgan library is a logging middleware for Node.js and Express applications. It helps log HTTP requests made to your server, making it easier to track incoming traffic, debug issues, and monitor the performance of your application.
import favicon from 'serve-favicon'//The serve-favicon library in Node.js and Express applications is used to serve the favicon (the small icon displayed in browser tabs) for your website. It simplifies the process of serving the favicon by handling the necessary request for it and delivering the file efficiently.
import path from 'path'//The path library in Node.js provides utilities for working with file and directory paths. It helps you easily manipulate file paths, handle cross-platform differences (like slashes in file paths), and resolve absolute or relative paths within your project.
import { fileURLToPath } from "url";
import { connectToDB } from "./config/database.js";
import usersRouter from './routes/api/users.js'

dotenv.config();

const app = express();
// Use CORS middleware
app.use(cors());

app.use(logger('dev'));
app.use(express.json())//allows us to accept json  data  in the  body

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url); // Get the filename
const __dirname = path.dirname(__filename); // Get the directory name

// Serve static files from the React app
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

// Define API routes
app.use('/api/users', usersRouter);

//create routes,
app.get("/", (req, res) => {
    res.send("Hello Cedric, your server is ready!");
});

app.listen(3000, () => {
    connectToDB();//connect to MongoDB
    console.log("Hi Cedric, your server started at http://localhost:3000");
});
