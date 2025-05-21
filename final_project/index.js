const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

const secretKey = "My Secret Key"; 

app.use("/customer/auth/*", function auth(req,res,next){
    const token = req.session.authorization?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Access token not found in session." });
    }

    try {
        const decoded = jwt.verify(token, secretKey); // Replace with your actual JWT secret
        req.user = decoded; // Attach user info to request if needed
        next(); // Proceed to route handler
    } catch (err) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token." });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`Server is running on PORT: ${PORT}`));
