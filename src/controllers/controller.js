import tasks from "../models/tasks.js";
import categoriesT from "../models/categories.js";
import role from "../models/roles.js";
import jwt from "jsonwebtoken";

export async function home(req, res) {
  if (!req.cookies.user) {
    return res.redirect("/login");
  }
  const cookie = req.cookies.user;
  jwt.verify(cookie, process.env.TOKEN_SALT, function (err, decoded) {
    if (err) {
      res.clearCookie("user");
      return res.redirect("/login");
    }
  });
  const userMeta = jwt.verify(cookie, process.env.TOKEN_SALT);

  const activeCat = await categoriesT
    .query()
    .where("user", userMeta.id)
    .andWhere("active", 1);

  const todoTasks = await tasks
    .query()
    .where("user", userMeta.id)
    .andWhere("categorie", activeCat[0].id)
    .andWhere("finished", 0);

  const finishedTasks = await tasks
    .query()
    .where("user", userMeta.id)
    .andWhere("categorie", activeCat[0].id)
    .andWhere("finished", 1);

  const categories = await categoriesT.query().where("user", userMeta.id);
  res.render("home", {
    dataCat: {
      categories: categories,
      data: {
        finishedTasks,
        todoTasks,
      },
    },
  });
}

export async function login(req, res) {
  if (req.cookies.user) {
    return res.redirect("/");
  }

  const inputs = [
    {
      name: "email",
      label: "Email",
      type: "email",
      value: req.body.email,
      err: req.formErrorFields?.email ? req.formErrorFields.email : "",
    },
    {
      name: "password",
      label: "Wachtwoord",
      type: "password",
      err: req.formErrorFields?.password ? req.formErrorFields.password : "",
    },
  ];

  const flash = req.flash || {};

  res.render("login", { layout: "auth", inputs, flash, title: "login" });
}

export async function register(req, res) {
  const inputs = [
    {
      name: "firstname",
      label: "Voornaam",
      type: "text",
      value: req.body.firstname,
      err: req.formErrorFields?.firstname ? req.formErrorFields.firstname : "",
    },
    {
      name: "lastname",
      label: "Achternaam",
      type: "text",
      value: req.body.lastname,
      err: req.formErrorFields?.lastname ? req.formErrorFields.lastname : "",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      value: req.body.email,
      err: req.formErrorFields?.email ? req.formErrorFields.email : "",
    },
    {
      name: "password",
      label: "Wachtwoord",
      type: "password",
      err: req.formErrorFields?.password ? req.formErrorFields.password : "",
    },
  ];

  const roles = await role.query();

  const flash = req.flash || {};

  res.render("register", {
    layout: "auth",
    inputs,
    roles,
    flash,
    title: "register",
  });
}

export async function logout(req, res) {
  res.clearCookie("user");
  res.redirect("/login");
}
