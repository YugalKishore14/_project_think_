require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./utils/cloudinary");
const upload = require("./utils/storage");
const { error } = require("console");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
    .connect(process.env.DATABASE_URL, {})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Product Schema
const counterSchema = new mongoose.Schema({
    _id: String,
    seq: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", counterSchema);

const productSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: String,
    image: String,
    category: String,
    new_price: Number,
    old_price: Number,
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});
const Product = mongoose.model("Product", productSchema);


// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String, enum: ['user', 'admin'], default: 'user'
    },
    cartData: Object,
    date: { type: Date, default: Date.now },
});

const Users = mongoose.model("Users", userSchema);


// Routes
app.get("/", (req, res) => res.send("Express App is Running"));

// Upload Image
app.post("/upload", upload.single("product"), (req, res) => {
    try {
        res.json({ success: true, image_url: req.file.path });
    } catch (err) {
        res.status(500).json({ success: false, message: "Upload failed" });
    }
});

// Add Product
app.post("/addproduct", async (req, res) => {
    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: "product_id" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const newProduct = new Product({
            id: counter.seq,
            ...req.body,
        });

        await newProduct.save();
        res.json({ success: true, message: "Product added successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding product" });
    }
});

// Remove Product
app.post("/removeproduct", async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing product" });
    }
});

// Get All Products
app.get("/allproducts", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Error fetching products" });
    }
});

// Signup
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let check = await Users.findOne({ email });
        if (check) return res.status(400).json({ success: false, errors: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        let cart = {};
        for (let i = 0; i < 300; i++) cart[i] = 0;

        const user = new Users({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            cartData: cart,
        });

        await user.save();

        const token = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET);

        res.json({ success: true, token, role: user.role });
    } catch (error) {
        res.status(500).json({ success: false, message: "Signup failed" });
    }
});



// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });
        if (!user) return res.json({ success: false, errors: "Wrong Email Id" });

        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) return res.json({ success: false, errors: "Wrong Password" });

        const token = jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET);

        res.json({ success: true, token, role: user.role });
    } catch (error) {
        res.status(500).json({ success: false, message: "Login failed" });
    }
});



// New Collection
app.get("/newcollection", async (req, res) => {
    let products = await Product.find({});
    let newCollection = products.slice(1).slice(-8);
    res.send(newCollection);
});

// Popular in Women
app.get("/popularwomen", async (req, res) => {
    try {
        let products = await Product.find({ category: "women" });
        let popular = products.slice(0, 4);
        res.send(popular);
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Error fetching popular products" });
    }
});

//  creating middleware to fetch user
const fetchUser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(400).send({ error: "Please authenticate using a valid token" });
    }
};

// Add to Cart
app.post("/addtocart", fetchUser, async (req, res) => {
    // console.log(req.body, req.user);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send('Added');
});


// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
