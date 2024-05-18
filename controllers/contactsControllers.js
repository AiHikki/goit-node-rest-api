import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js";

const getAllContacts = async (req, res, next) => {
  try {
    const { favorite, page = 1, limit = 20 } = req.query;
    const owner = req.user.id;

    let query = { owner };

    if (typeof favorite !== "undefined") {
      query.favorite = favorite;
    }

    const startIndex = (page - 1) * limit;

    const contacts = await Contact.find(query).skip(startIndex).limit(limit);

    const total = await Contact.countDocuments(query);

    const pagination = {
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      pageSize: limit,
      totalCount: total,
    };

    res.json({ contacts, pagination });
  } catch (error) {
    next(error);
  }
};

const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = req.user.id;
    const contact = await Contact.findOne({ _id: id, owner });
    if (!contact) {
      throw HttpError(404);
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = req.user.id;
    const contact = await Contact.findOne({ _id: id, owner });
    if (!contact) {
      throw HttpError(404);
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const owner = req.user.id;
    const contactData = {
      ...req.body,
      owner,
    };
    const contact = await Contact.create(contactData);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = req.user.id;
    const contact = await Contact.findOneAndUpdate(
      { _id: id, owner },
      req.body,
      {
        new: true,
      }
    );

    if (!contact) {
      throw HttpError(404);
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = req.user.id;
    const contact = await Contact.findOneAndUpdate(
      { _id: id, owner },
      req.body,
      {
        new: true,
      }
    );

    if (!contact) {
      throw HttpError(404);
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export {
  updateStatusContact,
  updateContact,
  createContact,
  deleteContact,
  getOneContact,
  getAllContacts,
};
