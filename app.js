const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blogs");

const app = express();

const dbURI =
    "mongodb+srv://cdeluchi:cdeluchiMongodb@cdeluchi.lvgtt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
    .connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => app.listen(3000))
    .catch((err) => console.log("err in mongoose", err));

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlendcoded({ extended: true }));
app.use(morgan("dev"));

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/blogs");
});

app.get("/about", (req, res) => {
    res.render("about", { title: "About" });
});

app.get("/blogs/create", (req, res) => {
    res.render("create", { title: "Create a new blog" });
});

app.get("/blogs", (req, res) => {
    Blog.find()
        .sort({ createdAt: -1 })
        .then((result) => {
            res.render("index", { blogs: result, title: "All blogs" });
        })
        .catch((err) => console.log("err in blogs", err));
});
app.post("/blogs", (req, res) => {
    console.log("body in post blogs", req.body);
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect("/blogs");
        })
        .catch((err) => console.log("err in blog save", err));
});

app.get("./blogs/:id", (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render("details", { blog: result, title: "Blog Details" });
        })
        .catch((err) => console.log("err in get/blogs/id", err));
});

app.delete("/blogs/:id", (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: "/blogs" });
        })
        .catch((err) => console.log("err in delete blog", err));
});

app.use((req, res) => {
    res.status(404).render("404", { title: "404" });
});
