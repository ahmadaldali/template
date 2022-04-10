const { Sequelize, Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  // Model attributes are defined here
  user1UnreadMsg: {
    type: Sequelize.INTEGER,
  },
  user2UnreadMsg: {
    type: Sequelize.INTEGER
  }
});

// find conversation given two user Ids
Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });
  // return conversation or null if it doesn't exist
  return conversation;
};


Conversation.updateConversation = async function (conversation, user1UnreadMsg = 0, user2UnreadMsg = 0) {
    const values = {
      user1Id: conversation.user1Id,
      user2Id: conversation.user2Id,
      user1UnreadMsg: user1UnreadMsg,
      user2UnreadMsg: user2UnreadMsg
    }
    const updatedRecord= await conversation.update(values);
    return updatedRecord;
};

module.exports = Conversation;
