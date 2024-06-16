import tasks from "../../models/tasks.js";
import categories from "../../models/categories.js";
import role from "../../models/roles.js";
import User from "../../models/User.js";
import { validationResult } from "express-validator";
import MailTransporter from "../../lib/MailTransporter.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function getToken(req) {
  const cookie = req.cookies.user;
  return jwt.verify(cookie, process.env.TOKEN_SALT);
}

export async function postTask(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      status: "error",
      ...errors,
    });
  }

  const task = req.body;
  const user = getToken(req);
  const categorie = await categories
    .query()
    .where("active", true)
    .andWhere("user", user.id);

  await tasks
    .query()
    .insert({ task: task.task, categorie: categorie[0].id, user: user.id });

  updateMail(
    "Added a new task",
    `<h1>Added a new task</h1><p>You added a new task in the category: ${categorie[0].categorie}</p><ul><li>${task.task}</li></ul>`,
    user
  );
  res.redirect("/");
}

export function taskChanges(req, res) {
  const method = req.body.method;
  switch (method) {
    case "PUT":
      editTask(req, res);
      break;
    case "PATCH":
      changeTask(req, res);
      break;
    case "DELETE":
      deletetask(req, res);
      break;
  }
}

async function editTask(req, res) {
  const user = getToken(req);
  const body = req.body;

  await tasks.query().findById(body.id).patch({ finished: true });
  const finishedTask = await tasks.query().findById(body.id);

  updateMail(
    "finished a task",
    `<h1>Finished a task</h1><p>You selected that this task is finished:</p><ul><li>${finishedTask.task}</li></ul>`,
    user
  );
  res.redirect("/");
}

async function changeTask(req, res) {
  const body = req.body;
  const user = getToken(req);

  await tasks.query().findById(body.id).patch({ task: body.newTask });

  updateMail(
    "renamed a task",
    `<h1>Renamed a task</h1><p>You changed:</p><ul><li>${body.task}</li></ul><p>To this:</p><ul><li>${body.newTask}</li></ul>`,
    user
  );
  res.redirect("/");
}

export function catChanges(req, res) {
  const method = req.body.method;
  switch (method) {
    case "DELETE":
      deleteCat(req, res);
      break;
    case "PATCH":
      changeCat(req, res);
      break;
    case "PUT":
      editCat(req, res);
      break;
  }
}

async function deleteCat(req, res) {
  const body = req.body;
  const user = getToken(req);
  await categories.query().deleteById(body.id);
  await tasks.query().delete().where("categorie", body.id);
  await categories
    .query()
    .where("user", user.id)
    .first()
    .patch({ active: true });
  res.redirect("/");
}

async function editCat(req, res) {
  const body = req.body;

  await categories.query().findById(body.id).patch({ categorie: body.newCat });
  res.redirect("/");
}

async function changeCat(req, res) {
  const body = req.body;
  const user = getToken(req);
  await categories.query().where("user", user.id).patch({ active: false });
  await categories.query().findById(body.id).patch({ active: true });
  res.redirect("/");
}

async function deletetask(req, res) {
  const user = getToken(req);
  const body = req.body;

  await tasks.query().deleteById(body.id);

  updateMail(
    "deleted a task",
    `<h1>deleted a task</h1><p>You deleted this task:</p><ul><li>${body.task}</li></ul>`,
    user
  );
  res.redirect("/");
}

export async function addCat(req, res) {
  const errors = validationResult(req);
  const user = getToken(req);

  if (!errors.isEmpty()) {
    return res.json({
      status: "error",
      ...errors,
    });
  }

  const body = req.body;
  await categories.query().insert({ categorie: body.categorie, user: user.id });

  updateMail(
    "Added a new category",
    `<h1>Added a new category</h1><p>You added a new category:</p><ul><li>${req.body.categorie}</li></ul>`,
    getToken(req)
  );
  res.redirect("/");
}

export async function sendMail(req, res) {
  const errors = validationResult(req);
  console.log(req.body);

  if (!errors.isEmpty()) {
    return res.json({
      status: "error",
      ...errors,
    });
  }
  const user = getToken(req);

  const category = await categories.query().where("active", 1);
  const todotasks = await tasks
    .query()
    .where("finished", 0)
    .andWhere("categorie", category[0].id)
    .andWhere("user", user.id);

  MailTransporter.sendMail({
    from: user.email,
    to: req.body.email,
    subject: `Tasks of ${category[0].categorie}`,
    template: "tasks",
    context: {
      title: `Tasks of ${category[0].categorie}`,
      tasks: todotasks,
    },
  });
  res.json({
    type: "success",
    message: "Your email has been sent",
  });
}

function updateMail(subject, message, user) {
  MailTransporter.sendMail({
    from: "noreply@justDoIt.be",
    to: user.email,
    subject: subject,
    template: "update",
    context: {
      message: message,
    },
  });
}

export async function tryRegister(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.formErrorFields = {};
    errors.array().forEach((error) => {
      req.formErrorFields[error.path] = error.msg;
    });

    req.flash = {
      type: "danger",
      message: "Er zijn fouten gevonden in de ingevulde velden",
    };

    return next();
  }

  const userExists = await User.query().findOne({ email: req.body.email });
  if (userExists) {
    req.flash = {
      type: "danger",
      message: "Gebruiker bestaat al",
    };
    return next();
  }

  const hash = bcrypt.hashSync(req.body.password, 10);

  await User.query().insert({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hash,
    role_id: parseInt(req.body.role),
  });

  const user = await User.query().max("id").first();
  const id = user["max(`id`)"];

  const activeCat = await categories
    .query()
    .where("active", 1)
    .andWhere("user", id)
    .first();

  if (!activeCat) {
    await categories
      .query()
      .insert({ categorie: "Default", user: id, active: true });
  }

  updateMail(
    "Registered a new account",
    `
  <h1>Added a new account</h1><p>This email was used to add register an account on www.JustDoIT.be if this is you please click on the verify button</p>
  <button style="background-color:blue;border-radius:1rem">Verify</button>`,
    req.body
  );
  res.redirect("/login");
}

export async function tryLogin(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.formErrorFields = {};
    errors.array().forEach((error) => {
      req.formErrorFields[error.path] = error.msg;
    });

    req.flash = {
      type: "danger",
      message: "Er zijn fouten gevonden in het formulier",
    };
    return next();
  }

  const user = await User.query().findOne({ email: req.body.email });
  if (!user) {
    req.flash = {
      type: "danger",
      message: "Gebruiker bestaat niet",
    };
    return next();
  }
  const match = bcrypt.compareSync(req.body.password, user.password);

  if (!match) {
    req.flash = {
      type: "danger",
      message: "Wachtwoord is niet juist",
    };
    return next();
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.TOKEN_SALT,
    {
      expiresIn: "1h",
    }
  );

  res.cookie("user", token, { httpOnly: true });

  res.redirect("/");
}
