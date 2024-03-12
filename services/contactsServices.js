import { Contact } from "../models/contact.js";

export async function listContacts(owner) {
  const contacts = await Contact.find(owner).populate("owner", "name email");
  return contacts;
}

export async function getContactById(_id, owner) {
  const result = await Contact.findOne({ owner, _id });
  return result || null;
}

export async function addContact(info) {
  const newContact = await Contact.create(info);
  return newContact;
}

export async function removeContact(_id, owner) {
  const result = await Contact.findOneAndDelete({ _id, owner });
  return result;
}

export async function updateContactById(id, data) {
  const contacts = await Contact.findOneAndUpdate(id, data, { new: true });
  return contacts;
}
