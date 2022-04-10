const { Conversation } = require("../db/models");


const  decreaseUnreadMessage = async function decreaseUnreadMessage(conversation, senderId) {
    let user1UnreadMsg = conversation.user1UnreadMsg;
    let user2UnreadMsg = conversation.user2UnreadMsg;
    (senderId == conversation.user1Id) ?
        --user2UnreadMsg :
        --user1UnreadMsg;
    await Conversation.updateConversation(conversation, user1UnreadMsg, user2UnreadMsg);
}

const increaseUnreadMessage = async function increaseUnreadMessage(conversation, senderId) {
    //increase number of unread msg for the other user in the conversation
    let user1UnreadMsg = conversation.user1UnreadMsg;
    let user2UnreadMsg = conversation.user2UnreadMsg;
    (senderId == conversation.user1Id) ?
        ++user2UnreadMsg :
        ++user1UnreadMsg;
    await Conversation.updateConversation(conversation, user1UnreadMsg, user2UnreadMsg);
}

module.exports = {increaseUnreadMessage , decreaseUnreadMessage};
