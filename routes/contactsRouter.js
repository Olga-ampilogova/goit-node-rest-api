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

const BASE_URL = "/api/contacts";

contactsRouter.get(`${BASE_URL}/`, getAllContacts);

contactsRouter.get(`${BASE_URL}/:id`, getOneContact);

contactsRouter.delete(`${BASE_URL}/:id`, deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put(`${BASE_URL}/:id`, updateContact);

contactsRouter.patch(`${BASE_URL}/:id/favorite`, updateStatusContact);

export default contactsRouter;
