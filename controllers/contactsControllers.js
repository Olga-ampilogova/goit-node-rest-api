import { createContactSchema, updateContactSchema, updateFavoriteField } from "../schemas/contactsSchemas.js";
import Contact from "../models/contacts.js"
import mongoose from "mongoose";

export async function getAllContacts(req, res, next) {
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const filter = { ownerId: req.user.id };
     if (req.query.favorite !== undefined) {
       if (req.query.favorite === "true") {
         filter.favorite = true;
       }
     }
  try {
    const contacts = await Contact.find(filter)
      .skip(skip)
      .limit(limit);
        res.status(200).json({
          page,
          limit,
          totalCount: await Contact.countDocuments(filter),
          data: contacts,
        });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export async function getOneContact(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Not found" });
    }

    const contact = await Contact.findOne({ _id: id, ownerId: req.user.id });
    if (contact === null) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
     res.status(500).json({ error: "Internal Server Error" });
  };
}

export async function deleteContact (req, res) {
  try {
    const { id } = req.params;
     if (!mongoose.isValidObjectId(id)) {
       return res.status(404).json({ message: "Not found" });
     }
    const contact = await Contact.findOneAndDelete({ _id:id, ownerId: req.user.id })
    console.log(contact);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
     console.error("Error deleting contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export async function createContact(req, res, next) {
  console.log(req.user);
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
      ownerId: req.user.id
    };
    const result = await Contact.create(contact);
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
     res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function updateContact (req, res) {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }
     if (!mongoose.isValidObjectId(id)) {
       return res.status(404).json({ message: "Not found" });
     }
  const updatedContact = await Contact.findOneAndUpdate({_id: id, ownerId: req.user.id}, updatedFields, {new:true})

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
  const { favorite } = req.body;
  const { error: validationError } = updateFavoriteField.validate(req.body, {
    convert: false,
  });
  if (validationError) {
    return res
      .status(400)
      .json({ message: validationError.details[0].message });
  }
  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Not found" });
    }

    const updatedField = await Contact.findOneAndUpdate(
   {_id:id, ownerId: req.user.id },
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