import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { Contact } from "../models/contact.js";

// const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const data = await Contact.find();

  return JSON.parse(data);
}

function writeContacts(contacts) {
  return fs.writeFile(Contact.find(), JSON.stringify(contacts, undefined, 2));
}

export async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

export async function getContactById(contactId) {
  const contacts = await readContacts();
  const result = contacts.find((contact) => contact.id === contactId);
  return result || null;
}

export async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  contacts.push(newContact);
  await writeContacts(contacts, null, 2);
  return newContact;
}

export async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await writeContacts(contacts, null, 2);
  return result;
}

export async function updateContactById(id, data) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((contact) => contact.id === id);
  if (contactIndex === -1) {
    return null;
  }
  const contactById = contacts.find((contact) => contact.id === id);
  contacts[contactIndex] = { id, ...contactById, ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[contactIndex];
}
