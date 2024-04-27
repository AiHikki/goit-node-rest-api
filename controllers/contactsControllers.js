import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  modifyContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const contacts = await listContacts();
  res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(contact);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await removeContact(id);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(contact);
};

export const createContact = async (req, res) => {
  const contact = req.body;

  const newContact = await addContact(contact);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;

  const updatedContact = await modifyContact(id, req.body);

  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(updatedContact);
};
