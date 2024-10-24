/*
Here's the specific role of the controllers:

- Handling requests: When a user sends a request (e.g., via the frontend), the controller processes the request. 
It decides what to do with it, often by interacting with the model to retrieve or update data.

- Business logic: The controller contains most of the application's business logic. 
For instance, after fetching data from the model, the controller can format or validate it before sending it to the view (e.g., React frontend or an API response).

-  Routing: In Express, routes are often tied to specific controller functions. 
For example, a route for fetching users may call the UserController.getUsers() method.

- Responding: After processing, the controller sends the appropriate response back to the client, 
typically in JSON format for a REST API, or it renders a view if it's a server-side rendered app.
*/

import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Use ES module import for User
const SECRET = process.env.SECRET;

async function signup(req, res) {
    const user = new User(req.body);
    try {
        await user.save();
        // Be sure to first delete data that should not be in the token
        const token = createJWT(user);
        console.log(token);
        res.json({ token });
    } catch (err) {
        // Probably a duplicate email
        res.status(400).json(err);
    }
}

async function login(req, res) {
    console.log("req", req);
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).json({ err: "bad credentials" });
        user.comparePassword(req.body.pw, (err, isMatch) => {
            if (isMatch) {
                const token = createJWT(user);
                res.json({ token });
            } else {
                return res.status(401).json({ err: "bad credentials" });
            }
        });
    } catch (err) {
        return res.status(401).json(err);
    }
}

/*----- Helper Functions -----*/

function createJWT(user) {
    return jwt.sign(
        { user }, // data payload
        SECRET,
        { expiresIn: "24h" }
    );
}

export default {
    signup,
    login,
};
