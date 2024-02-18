import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", updateContact);

export default contactsRouter;

// const express = require("express");
// const contactsRouter = express.Router();
// const contacts = require("../services/contactsServices");
// const router = express.Router();

// router.get("/", async (req, res) => {});
// const result = await contacts.getAll();
// res.json(result);

// module.exports = router;
