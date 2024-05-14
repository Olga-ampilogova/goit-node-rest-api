import { createContactSchema, updateContactSchema, idSchema } from "../schemas/contactsSchemas.js";
import crypto from "node:crypto";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  changeContact
} from "../services/contactsServices.js";
 import Contact from "../models/contacts.js"
//import { func } from "joi";

export async  function getAllContacts (req, res, next)  {
  try {
    const contacts = await Contact.find()
    // const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export async function getOneContact (req, res)  {
  try {
    const { id } = req.params;
    const { error: idError } = idSchema.validate(id);
      if (idError) {
       return res.status(404).json({ message: "Not found" });
     }
    const contact = await Contact.findById(id);
    console.log(contact);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export async function deleteContact (req, res) {
  try {
    const { id } = req.params;
      const { error: idError } = idSchema.validate(id);
      if (idError) {
        return res.status(400).json({ message: "Not found" });
      }
    const contact = await Contact.findByIdAndDelete(id)
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


export async function createContact(req, res, next) {
  
  try {
  
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
      const { error } = createContactSchema.validate(contact, {
        convert: false,
      });
      if (typeof error !== "undefined") {
        return res.status(400).json({ message: error.message });
      }
    const result = await Contact.create(contact);
    console.log(result);
    res.status(201).json(contact);
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
      //    console.error("Error creating contact:", error);
      // res.status(500).json({ error: "Internal Server Error" });
  }
}
    // const { error} = createContactSchema.validate(contact, {
    //   convert: false,
    // });
    // if (typeof error !== "undefined") {
    //  return res.status(400).json({message:error.message})
    // }
//     const newContact = await addContact(contact)
//     res.status(201).json(newContact)
//   } catch (error) {
//         console.error("Error creating contact:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


export async function updateContact (req, res) {
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
   const { error: idError } = idSchema.validate(id);
   if (idError) {
     return res.status(400).json({ message: "Not found" });
   }
    const updatedContact = await Contact.findByIdAndUpdate(id, updatedFields, {new:true})

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export async function updateStatusContact(req, res) {
  const { id } = req.params;
  const {favorite} = req.body;
  try {
    const { error: idError } = idSchema.validate(id);
    if (idError) {
      return res.status(400).json({ message: "Not found" });
    }

    const updatedField = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );
    if (!updatedField) {
      return res.status(404).json({ message: "Not found" });
      
    }
    res.status(200).json(updatedField);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}