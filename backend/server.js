//entry point for our api
import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/database.js";

dotenv.config();

const app = express();

//create routes
app.get("/", (req, res) => {
    res.send("Hello Cedric, your server is ready!");
});

app.listen(3000, () => {
    connectToDB();
    console.log("Hi Cedric, your server started at http://localhost:3000");
});
