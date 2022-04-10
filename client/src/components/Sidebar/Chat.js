import React from 'react';
import { Box } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import  UnReadMessage from './UnReadMessage';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },

  circle: {
    width: '20px',
    height: '20px',
    textAlign: 'center',
    color: 'white',
    font: '12 Open Sans, Open Sans',
    backgroundColor: '#3F92FF',
    border: '2px solid #3F92FF',
    borderRadius: '50%',
    borderWidth: 1,
    marginRight: 10
  }
}));

const Chat = ({ conversation, setActiveChat }) => {
  const classes = useStyles();
  const { otherUser } = conversation;

  const unreadMsgs = conversation.hasOwnProperty('user1')
                     ? conversation.user1UnreadMsg
                     : conversation.user2UnreadMsg;

  const handleClick = async (conversation) => {
    await setActiveChat(conversation);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />

      <ChatContent conversation={conversation} />
      <UnReadMessage unreadMsgs={unreadMsgs} />
    </Box>
  );
};

export default Chat;
