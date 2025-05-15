
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");
// const fs = require("fs");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // MongoDB Connection
// mongoose
//     .connect(process.env.DATABASE_URL, {})
//     .then(() => console.log("MongoDB Connected"))
//     .catch((err) => console.error("MongoDB Connection Error:", err));

// // Ensure Upload Folder Exists
// const uploadFolder = path.join(__dirname, "upload/images");
// if (!fs.existsSync(uploadFolder)) {
//     fs.mkdirSync(uploadFolder, { recursive: true });
// }

// // Multer Storage Config
// const storage = multer.diskStorage({
//     destination: uploadFolder,
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//     },
// });
// const upload = multer({ storage });

// // Serve uploaded images statically
// app.use("/images", express.static(uploadFolder));

// // Auto-increment Counter Schema
// const counterSchema = new mongoose.Schema({
//     _id: {
//         type: String,
//         required: true
//     },
//     seq: {
//         type: Number,
//         default: 0
//     },
// });
// const Counter = mongoose.model("Counter", counterSchema);

// // Product Schema
// const productSchema = new mongoose.Schema({
//     id: {
//         type: Number,
//         unique: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     image: {
//         type: String,
//         required: true
//     },
//     category: {
//         type: String,
//         required: true
//     },
//     new_price: {
//         type: Number,
//         required: true
//     },
//     old_price: {
//         type: Number,
//         required: true
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     },
//     available: {
//         type: Boolean,
//         default: true
//     },
// });
// const Product = mongoose.model("Product", productSchema);

// // User Schema
// const userSchema = new mongoose.Schema({
//     name: {
//         type: String
//     },
//     email: {
//         type: String,
//         unique: true
//     },
//     password: {
//         type: String
//     },
//     cartData: {
//         type: Object
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     },
// });
// const Users = mongoose.model("Users", userSchema);

// // Routes
// app.get("/", (req, res) => res.send("Express App is Running"));

// // Upload Image
// app.post("/upload", upload.single("product"), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json(
//             {
//                 success: false,
//                 message: "No file uploaded"
//             }
//         );
//     }

//     const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
//     res.json(
//         {
//             success: true,
//             image_url: imageUrl
//         }
//     );
// });

// // Add Product
// app.post("/addproduct", async (req, res) => {
//     try {
//         const counter = await Counter.findByIdAndUpdate(
//             {
//                 _id: "product_id"
//             },
//             {
//                 $inc: {
//                     seq: 1
//                 }
//             },
//             {
//                 new: true, upsert: true
//             }
//         );

//         const newProduct = new Product({
//             id: counter.seq,
//             ...req.body,
//         });

//         await newProduct.save();
//         res.json({ success: true, message: "Product added successfully" });
//     } catch (error) {
//         console.error("Add Product Error:", error);
//         res.status(500).json(
//             {
//                 success: false,
//                 message: "Error adding product"
//             }
//         );
//     }
// });

// // Remove Product
// app.post("/removeproduct", async (req, res) => {
//     try {
//         await Product.findOneAndDelete({ id: req.body.id });
//         res.json(
//             {
//                 success: true,
//                 message: "Product removed successfully"
//             }
//         );
//     } catch (error) {
//         res.status(500).json(
//             {
//                 success: false,
//                 message: "Error removing product"
//             }
//         );
//     }
// });

// // Get All Products
// app.get("/allproducts", async (req, res) => {
//     try {
//         const products = await Product.find({});
//         res.json(products);
//     } catch (error) {
//         res.status(500).json(
//             {
//                 success: false,
//                 message: "Error fetching products"
//             }
//         );
//     }
// });

// // Signup
// app.post("/signup", async (req, res) => {
//     try {
//         let check = await Users.findOne(
//             {
//                 email: req.body.email
//             }
//         );
//         if (check) {
//             return res.status(400).json(
//                 {
//                     success: false,
//                     errors: "User already exists"
//                 }
//             );
//         }

//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         let cart = {};
//         for (let i = 0; i < 300; i++) {
//             cart[i] = 0;
//         }

//         const user = new Users(
//             {
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: hashedPassword,
//                 cartData: cart,
//             }
//         );

//         await user.save();

//         const data = {
//             user: {
//                 id: user.id,
//             },
//         };

//         const token = jwt.sign(data, process.env.JWT_SECRET);
//         res.json(
//             {
//                 success: true,
//                 token
//             }
//         );
//     } catch (error) {
//         console.error("Signup Error:", error);
//         res.status(500).json(
//             {
//                 success: false,
//                 message: "Signup failed"
//             }
//         );
//     }
// });

// // Login
// app.post("/login", async (req, res) => {
//     try {
//         const user = await Users.findOne(
//             {
//                 email: req.body.email
//             }
//         );
//         if (!user) {
//             return res.json(
//                 {
//                     success: false,
//                     errors: "Wrong Email Id"
//                 }
//             );
//         }

//         const passCompare = await bcrypt.compare(req.body.password, user.password);
//         if (!passCompare) {
//             return res.json(
//                 {
//                     success: false,
//                     errors: "Wrong Password"
//                 }
//             );
//         }

//         const data = {
//             user: {
//                 id: user._id,
//             },
//         };

//         const token = jwt.sign(data, process.env.JWT_SECRET);
//         res.json({ success: true, token });
//     } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).json(
//             {
//                 success: false,
//                 message: "Login failed"
//             }
//         );
//     }
// });

// // New Collection
// app.get("/newcollection", async (req, res) => {
//     try {
//         let products = await Product.find({});
//         let newCollection = products.slice(-8); // Last 8 products
//         res.send(newCollection);
//     } catch (error) {
//         res.status(500).json(
//             {
//                 success: false,
//                 message: "Error fetching collection"
//             }
//         );
//     }
// });

// // Popular in Women
// app.get("/popularwomen", async (req, res) => {
//     try {
//         let products = await Product.find(
//             {
//                 category: "women"
//             }
//         );
//         let popular = products.slice(0, 4);
//         res.send(popular);
//     } catch (error) {
//         res.status(500).json(
//             {
//                 success: false,
//                 message: "Error fetching popular products"
//             }
//         );
//     }
// });


// app.post('/addtocart', async (req, res) => {


// })



// // Start Server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });






// server.js
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

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URL, {})
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
        res.status(500).json({ success: false, message: "Error fetching products" });
    }
});

// Signup
app.post("/signup", async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) return res.status(400).json({ success: false, errors: "User already exists" });

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let cart = {};
        for (let i = 0; i < 300; i++) cart[i] = 0;

        const user = new Users({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            cartData: cart,
        });

        await user.save();
        const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Signup failed" });
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email });
        if (!user) return res.json({ success: false, errors: "Wrong Email Id" });

        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (!passCompare) return res.json({ success: false, errors: "Wrong Password" });

        const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Login failed" });
    }
});

// New Collection
app.get("/newcollection", async (req, res) => {
    try {
        let products = await Product.find({});
        let newCollection = products.slice(-8);
        res.send(newCollection);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching collection" });
    }
});

// Popular in Women
app.get("/popularwomen", async (req, res) => {
    try {
        let products = await Product.find({ category: "women" });
        let popular = products.slice(0, 4);
        res.send(popular);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching popular products" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));