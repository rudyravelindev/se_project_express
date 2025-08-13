const ClothingItem = require("../models/clothingItem");
const { NotFoundError, ForbiddenError } = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      // Explicitly select fields to return
      const itemResponse = item.toObject();
      delete itemResponse.__v; // Remove version key
      res.status(201).json(itemResponse);
    })
    .catch((error) => {
      console.error("Detailed creation error:", {
        error: error.message,
        stack: error.stack,
        name: error.name,
      });
      next(error);
    });
};

const getItemById = (req, res, next) => {
  const { id } = req.params;

  ClothingItem.findById(id)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.send(item);
    })
    .catch(next);
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .sort({ createdAt: -1 })
    .lean() // Return plain JS objects
    .then((items) => {
      console.log(`Fetched ${items.length} items from DB`); // Debug log
      res.json(items);
    })
    .catch((err) => {
      console.error("Detailed fetch error:", {
        error: err.message,
        stack: err.stack,
      });
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(id)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("Not authorized to delete this item");
      }
      return ClothingItem.findByIdAndDelete(id);
    })
    .then(() => res.send({ message: "Item deleted" }))
    .catch(next);
};

const likeItem = (req, res, next) => {
  const { id } = req.params;

  ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.send(item);
    })
    .catch(next);
};

const dislikeItem = (req, res, next) => {
  const { id } = req.params;

  ClothingItem.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.send(item);
    })
    .catch(next);
};

module.exports = {
  createItem,
  getItemById,
  deleteItem,
  likeItem,
  dislikeItem,
  getItems,
};
