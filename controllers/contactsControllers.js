import HttpError from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";
import * as contactsService from "../services/contactsServices.js";
import { promises as fs } from "fs";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Route not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Route not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);
    const { name, email, phone } = req.body;
    const newContact = await contactsService.addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.updateContactById(id, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// export const updateContact = async (req, res, next) => {
//   try {
//     const { error, value } = updateContactSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.message });
//     }
//     const contactsDb = await fs.readFile("../db/contacts.json");
//     const contacts = JSON.parse(contactsDb);
//     const { name, email, phone } = value;
//     const { id } = req.params;
//     const contactIndex = contacts.findIndex((item) => item.id === id);
//     if (contactIndex === -1) {
//       return res.status(404).json({ message: "Route not found" });
//     }
//     const contact = contacts[contactIndex];
//     contact.name = name || contact.name;
//     contact.email = email || contact.email;
//     contact.phone = phone || contact.phone;
//     await fs.writeFile(
//       "../db/contacts.json",
//       JSON.stringify(contacts, null, 2)
//     );
//   } catch (error) {
//     next(error);
//   }
// };
