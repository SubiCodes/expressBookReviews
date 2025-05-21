const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists. Please choose another one." });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
});


// Get the book list available in the shop using async / await
public_users.get('/', async (req, res) => {
    try {
      const booksList = await Promise.resolve(books);
      res.status(200).json(booksList);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
  });

// Get book details based on ISBN with async / await 
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const book = await Promise.resolve(Object.values(books).find(b => b.isbn === isbn));
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving book', error: error.message });
    }
  });
  
  
// Get book details based on author with async / await
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const book = await Object.values(books).filter(b => b.author === author);
        if (book) {
            res.json(book);
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving book', error: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) =>  {
    try {
        const title = req.params.title;
        const book = await Object.values(books).filter(b => b.title === title);
        if (book) {
        res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving book', error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(b => b.isbn === isbn);
    const reviews = book.reviews;

    if (book) {
        res.json(reviews);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

module.exports.general = public_users;
