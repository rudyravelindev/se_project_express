const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageURL,
  })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      res.status(500).send({ message: "Error from createItem", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => {
      res.status(500).send({ message: "Error from getItems", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.send({ message: "Item deleted" });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from deleteItem", err });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
};
