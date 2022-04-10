const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const MessageGroup = require("./messageGroup");
const Participant = require("./participant");
const Group = require("./group");

// associations
User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

Participant.belongsTo(Group);
Participant.belongsTo(User);
User.hasMany(Participant);
Group.hasMany(Participant);
MessageGroup.belongsTo(Participant);
Participant.hasMany(MessageGroup);

module.exports = {
  User,
  Conversation,
  Message,
  Participant,
  Group,
  MessageGroup,
};