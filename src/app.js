const express=require("express");
const morgan=require("morgan");
const authRouter=require("./routes/auth.routes");
const cookieParser=require("cookie-parser");
const { uploadImage } = require("./services/storage.service");
const postModel=require("./models/post.model");
const cors = require("cors");

const multer=require("multer");

const app=express();

app.use(cors({
    origin: true, // Allow all origins explicitly, or configure as needed
    credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

const upload=multer({storage:multer.memoryStorage()});
app.post('/create-post', upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }
        const result = await uploadImage(req.file.buffer, req.file.originalname);
        if (!result) {
            return res.status(500).json({ message: "Failed to upload image" });
        }
        const caption = (req.body && req.body.caption) ? String(req.body.caption).trim() : "";
        const post = await postModel.create({
            image: result.url,
            caption: caption || "No caption"
        });
        res.status(200).json({ message: "Post created successfully", url: result.url, post });
    } catch (error) {
        console.error("Error in create-post:", error);
        res.status(500).json({ message: "Failed to create post", error: error.message });
    }
});

app.get("/posts", async (req, res) => {
    try {
        const posts = await postModel.find();
        res.status(200).json({ 
            message: "Posts fetched successfully",
            posts: posts
        });
    } catch (error) {
        console.error("Error in get-posts:", error);
        res.status(500).json({ 
            message: "Failed to fetch posts", 
            error: error.message 
        });
    }
});

app.use("/api/auth",authRouter);

module.exports = app;