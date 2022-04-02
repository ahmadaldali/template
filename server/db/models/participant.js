const { Sequelize, Op } = require("sequelize");
const db = require("../db");

const Participant = db.define("participant", {
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Participant;
