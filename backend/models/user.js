import mongoose from "mongoose";
import bcrypt from "bcrypt"; //password hashing function to store passwords by transforming them into cryptographic hash

const SALT_ROUNDS = 6;
/* 
Salt rounds, also referred to as the cost factor or work factor, determine the computational complexity of the hashing process. Essentially, the higher the number of salt rounds, the longer it takes to hash a password.
Bcrypt uses a two-step process for password hashing:
It generates a salt (a random string) and appends it to the password.
It applies the hashing algorithm a number of times (this number is determined by the salt rounds).
Salt Rounds Impact:
Lower salt rounds (e.g., 4): Faster hashing, but less secure since it’s easier to crack.
Higher salt rounds (e.g., 12 or more): Slower hashing, but significantly more secure because it takes longer for an attacker to attempt brute force attacks.
By increasing the salt rounds, bcrypt adapts to increasing processing power, making it harder for attackers to brute-force passwords. A typical recommended number of salt rounds is 10 to 12 for modern systems.
*/

const userSchema = new mongoose.Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true, lowercase: true, unique: true },
        password: String,
    },
    {
        timestamps: true,
    }
);

//This code snippet modifies the toJSON method of a Mongoose schema to exclude the password field when converting a document to JSON format.
userSchema.set("toJSON", {
    transform: function (doc, ret) {
        // remove the password property when serializing doc to JSON
        delete ret.password;
        return ret;
    },
});

// This code snippet is a middleware function for a Mongoose schema that hashes a user's password before saving it to the database.
userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return next();
    // password has been changed - salt and hash it
    bcrypt.hash(user.password, SALT_ROUNDS, function (err, hash) {
        if (err) return next(err);
        // replace the user provided password with the hash
        user.password = hash;
        next();
    });
});

// This code snippet defines a method comparePassword on the userSchema object, which is a Mongoose schema. The method uses the bcrypt library to compare a provided password with the stored hashed password for a user.
userSchema.methods.comparePassword = function (tryPassword, cb) {
    bcrypt.compare(tryPassword, this.password, cb);
};

const User = mongoose.model("User", userSchema);
export default User;
