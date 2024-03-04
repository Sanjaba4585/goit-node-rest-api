import { Contact } from "../models/contact.js";

export async function listContacts(owner) {
  const contacts = await Contact.find(owner).populate("owner", "name email");
  return contacts;
}

export async function getContactById(contactId) {
  const result = await Contact.findById(contactId);
  return result || null;
}

export async function addContact(info) {
  const newContact = await Contact.create(info);
  return newContact;
}

export async function removeContact(contactId) {
  const result = await Contact.findByIdAndDelete(contactId);
  return result;
}

export async function updateContactById(id, data) {
  const contacts = await Contact.findByIdAndUpdate(id, data, { new: true });
  return contacts;
}
