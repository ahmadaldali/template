const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const {increaseUnreadMessage} = require('../readStatus')

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const sender = req.user;
    const { recipientId, text } = req.body;

    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversation) {
      const conversationId = conversation.id;
      let message = await Message.create({ senderId, text, conversationId });
      await increaseUnreadMessage(conversation, senderId);
      //return the sender
      return res.json({ message, sender:null });
    }

    // create conversation
    conversation = await Conversation.create({
      user1Id: senderId,
      user2Id: recipientId,
    });
    if (onlineUsers.includes(sender.id)) {
      sender.online = true;
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    await increaseUnreadMessage(conversation, senderId, recipientId);
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
