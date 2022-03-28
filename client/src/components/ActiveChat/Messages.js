import React from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const messagesNum = messages.length;

  /*
  * Aonther solution
  const messagesBottomToTop = messages.reverse();
  map messagesBottomToTop to create each message
  */

  return (
    <Box>
      {messages.map((_ , index) => {
        const message = messages.at(messagesNum - index - 1);
        const time = moment(message.createdAt).format('h:mm');
        
        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
