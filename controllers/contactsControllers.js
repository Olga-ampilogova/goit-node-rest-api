import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import crypto from "node:crypto";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  changeContact
 } from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log();
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await removeContact(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log();
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const createContact = async (req, res) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
    const { error} = createContactSchema.validate(contact, {
      convert: false,
    });
    if (typeof error !== "undefined") {
     return res.status(400).json({message:error.message})
    }
    const newContact = await addContact(contact)
    res.status(201).json(newContact)
  } catch (error) {
        console.error("Error creating contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    const { error } = updateContactSchema.validate(updatedFields, {
      convert: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedContact = await changeContact(id, updatedFields);

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};