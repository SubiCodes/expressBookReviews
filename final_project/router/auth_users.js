const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}


const secretKey = "My Secret Key"; 

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password." });
    }
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    req.session.authorization = {
        token: token,
        username: username
    };
    return res.status(200).json({ message: "Login successful.", token: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review || req.body.review;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!review) {
        return res.status(400).json({ message: "Review is required." });
    }

    const book = Object.values(books).find(b => b.isbn === isbn);

    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Add or update review
    book.reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully.", reviews: book.reviews });
});

//delete guide
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; 
  
    const book = Object.values(books).find(b => b.isbn === isbn);
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (book.reviews && book.reviews[username]) {
      // Delete this user's review
      delete book.reviews[username];
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      return res.status(404).json({ message: "Review by this user not found." });
    }
  });
  


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
