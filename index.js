const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/blogs", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const blogDBSchema = {
    title: String,
    image: String,
    body: String,
    created: Date
};
const Blog = mongoose.model("Blog", blogDBSchema);

app.get("/", (req, res) => {
    res.redirect("/blogs");
});

app.route("/blogs")
.get((req, res) => {
    Blog.find({}, (err, blogs) => {
        res.render("index", {
            blogs: blogs
        });
    });
})

.post((req, res) => {
    let blog = req.body.blog;
    blog.created = new Date();
    Blog.create(blog, (err, blog) => {
        if (err) {
            res.render("new");
        } else {
            console.log(blog);
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/new", (req, res) => {
    res.render("new");
});

app.route("/blogs/:id")
.get((req, res)=> {
    Blog.findById(req.params.id, (err, blog)=> {
        if (err) {
            res.redirect("/blogs");
        }
       res.render("show", {
          blog: blog
       });
    });
})

.delete((req, res) => {
    console.log(req.params.id);
    Blog.findByIdAndRemove(req.params.id, (err)=> {
        if(err) {
            console.log(err);
        }
        res.redirect("/");
    });
})

.put((req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedPost)=> {
        if (err) {
            res.redirect("/blogs");
        } else {
            console.log(updatedPost);
            res.redirect(`/blogs/${req.params.id}`);
        }
    })
});

app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog)=> {
        if (err) {
            res.redirect("/blogs");
        }
        res.render("edit", {
            blog: foundBlog
        });
    });
});

app.listen(8000);
