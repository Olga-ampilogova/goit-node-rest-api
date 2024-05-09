import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}
function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

 export  async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

export  async function getContactById(contactId) {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  if (typeof contact === "undefined") {
    return null;
  }
  return contact;
}

export async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const removedContact = contacts[index];
  const newContatacts = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];
  await writeContacts(newContatacts);
  return removedContact;
}

 export async function addContact({ name, email, phone }) {
  const contacts = await readContacts();
  const newContact = { name, email, phone, id: crypto.randomUUID() };
  contacts.push(newContact);
   await writeContacts(contacts);
     return newContact;
}

export const changeContact = async (contactId, updatedFields) => {
  const contacts = await readContacts();
  const [contact] = contacts.filter((el) => el.id === contactId);
  if (!contact) {
    return null;
  }
  if (updatedFields.hasOwnProperty("name")) {
    contact.name = updatedFields.name;
  }
  if (updatedFields.hasOwnProperty("email")) {
    contact.email = updatedFields.email;
  }
  if (updatedFields.hasOwnProperty("phone")) {
    contact.phone = updatedFields.phone;
  }
  await writeContacts(contacts);
  return contact;
};
