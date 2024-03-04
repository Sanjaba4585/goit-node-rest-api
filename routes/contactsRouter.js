import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import validId from "../helpers/validId.js";
import { auth } from "../middleware/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/",auth, getAllContacts);

contactsRouter.get("/:id", auth, getOneContact);

contactsRouter.delete("/:id", auth, deleteContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  auth,
  createContact
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  auth,
  updateContact
);

contactsRouter.patch("/:id/favorite", validId, auth, updateStatusContact);

export default contactsRouter;
