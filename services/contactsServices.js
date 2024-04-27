import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

function writeContacts(contacts) {
  fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  if (typeof contact === "undefined") return null;
  return contact;
}

async function removeContact(contactId) {
  const contacts = await readContacts();
  const contactToDelete = contacts.find((contact) => contact.id === contactId);

  if (typeof contactToDelete === "undefined") return null;
  const newContacts = contacts.filter(
    (contact) => contact.id !== contactToDelete.id
  );

  writeContacts(newContacts);
  return contactToDelete;
}

async function addContact({ name, email, phone }) {
  const contacts = await readContacts();
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  writeContacts(contacts);

  return newContact;
}

async function modifyContact(contactId, contactData) {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);

  if (typeof contact === "undefined") return null;

  const updatedContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );

  const updatedContact = {
    ...contact,
    ...contactData,
  };

  updatedContacts.push(updatedContact);

  writeContacts(updatedContacts);

  return updatedContact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  modifyContact,
};
