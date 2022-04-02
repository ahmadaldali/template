const Sequelize = require("sequelize");
const db = require("../db");

const MessageGroup = db.define("messageGroup", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = MessageGroup;
