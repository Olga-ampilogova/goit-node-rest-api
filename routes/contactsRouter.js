import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/api/contacts", getAllContacts);

contactsRouter.get("/api/contacts/:id", getOneContact);

contactsRouter.delete("/api/contacts/:id", deleteContact);

contactsRouter.post("/api/contacts", createContact);

contactsRouter.put("/api/contacts/:id", updateContact);

contactsRouter.patch("/api/contacts/:id/favorite", updateStatusContact);

export default contactsRouter;
