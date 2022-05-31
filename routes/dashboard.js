const express = require("express");
const Comment = require("../models/Comment");
const router = express.Router();
const Blog = require("../models/Blog");
const { ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, async (req, res) => {
  const articles = await Blog.find({}).sort({ createdAt: "desc" });
  const countAll = await Blog.countDocuments();
  const count = await Blog.find({
    username: req.user.username,
  }).countDocuments();
  res.render("dashboard", {
    articles: articles,
    user: req.user,
    countAll: countAll,
    count: count,
  });
});

router.get("/articles", ensureAuthenticated, async (req, res) => {
  const articles = await Blog.find({ username: req.user.username });
  res.render("articles", { articles: articles, user: req.user });
});

router.get("/articles/create", ensureAuthenticated, (req, res) => {
  res.render("create", { article: new Blog(), user: req.user });
});

router.get("/articles/edit/:id", async (req, res) => {
  const article = await Blog.findById(req.params.id);
  res.render("edit", { article: article, user: req.user });
});

router.get("/articles/:id", ensureAuthenticated, async (req, res) => {
  const article = await Blog.findById(req.params.id);
  if (article == null) res.redirect("/dashboard");
  res.render("show", { article: article });
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
  const article = await Blog.findById(req.params.id);
  const comments = await Comment.find({ blog: req.params.id });
  if (article == null) res.redirect("/dashboard");
  res.render("showpublic", {
    article: article,
    user: req.user,
    comment: comments,
  });
});

router.delete("/articles/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard/articles");
  } catch (e) {
    console.log(e);
  }
});

router.put("/edit/:id", async (req, res) => {
  let article = await Blog.findById(req.params.id);
  article.title = req.body.title;
  article.desc = req.body.description;
  article.markdown = req.body.markdown;
  article.username = await req.user.username;
  try {
    article = await article.save();
    res.redirect(`/dashboard/articles/${article.id}`);
  } catch (e) {
    res.render("edit", { article: article });
    console.log(e);
  }
});

router.post("/create", async (req, res) => {
  let article = new Blog({
    title: req.body.title,
    desc: req.body.description,
    markdown: req.body.markdown,
    username: req.user.username,
  });

  try {
    article = await article.save();
    res.redirect(`/dashboard/articles/${article.id}`);
  } catch (e) {
    console.log(e);
    res.render("create", { article: article });
  }
});

router.post("/:id", async (req, res) => {
  let comment = new Comment({
    text: req.body.text,
    blog: req.params.id,
    username: req.user.username,
  });

  await comment.save();
  let article = await Blog.findById(req.params.id);

  article.comments.push(comment);

  await article.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect(`/dashboard/${article.id}`);
  });
});

module.exports = router;
