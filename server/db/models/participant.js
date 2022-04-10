const { Sequelize, Op } = require("sequelize");
const db = require("../db");

const Participant = db.define("participant", {
});

module.exports = Participant;
