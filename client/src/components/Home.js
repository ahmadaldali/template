import React, { useCallback, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Grid, CssBaseline, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SidebarContainer } from '../components/Sidebar';
import { ActiveChat } from '../components/ActiveChat';
import { SocketContext } from '../context/socket';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
}));

const Home = ({ user, logout }) => {
  const history = useHistory();

  const socket = useContext(SocketContext);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addSearchedUsers = (users) => {
    const currentUsers = {};

    // make table of current users so we can lookup faster
    conversations.forEach((convo) => {
      currentUsers[convo.otherUser.id] = true;
    });

    const newState = [...conversations];
    users.forEach((user) => {
      // only create a fake convo if we don't already have a convo with this user
      if (!currentUsers[user.id]) {
        let fakeConvo = { otherUser: user, messages: [] };
        newState.push(fakeConvo);
      }
    });
    setConversations(newState);
  };

  const clearSearchedUsers = () => {
    setConversations((prev) => prev.filter((convo) => convo.id));
  };

  const saveMessage = async (body) => {
    const { data } = await axios.post('/api/messages', body);
    return data;
  };

  const sendMessage = (data, body) => {
    socket.emit('new-message', {
      message: data.message,
      recipientId: body.recipientId,
      sender: data.sender,
    });
  };

  const postMessage = (body) => {
    try {
      const data = saveMessage(body);
      data.then(res => {
        if (!body.conversationId) {
          addNewConvo(res, body.recipientId);
        } else {
          addMessageToConversation(res, body.recipientId);
        }
        sendMessage(res, body);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateCurrentConv =
    (method, conversations, data, recipientId) => {
      const newState = [...conversations];
      const message = data.message;
      const sender = data.sender;

      let currentConv = null;
      if (recipientId === undefined) {
        //recipent side
        currentConv = {
          id: message.conversationId,
          otherUser: sender,
          messages: [message],
          latestMessageText: message.text,
          user1: null,
          user1UnreadMsg: 1
        };

        newState.forEach((convo, index) => {
          if (convo.otherUser.id === message.senderId) {
            convo.messages.unshift(message);
            convo.latestMessageText = message.text;

            let user1UnreadMsg = convo.hasOwnProperty('user1UnreadMsg')
              ? convo.user1UnreadMsg : 0;
            let user2UnreadMsg = convo.hasOwnProperty('user2UnreadMsg')
              ? convo.user2UnreadMsg : 0;

            (convo.hasOwnProperty('user1')) ?
              ++user1UnreadMsg :
              ++user2UnreadMsg;

            currentConv = convo;
            currentConv.user1UnreadMsg = user1UnreadMsg;
            currentConv.user2UnreadMsg = user2UnreadMsg;

            newState.splice(index, 1);
            return;
          }
        });
      }
      else {
        //sender side
        newState.forEach((convo, index) => {
          if (convo.otherUser.id === recipientId) {
            convo.messages.unshift(message);
            convo.latestMessageText = message.text;
            //remove this conv and set it as the first
            currentConv = convo;
            newState.splice(index, 1);
            return;
          }
        });
      }
      newState.unshift(currentConv);
      return newState;
    }

  const addNewConvo = useCallback(
    (data, recipientId) => {
      const newState = updateCurrentConv("new", conversations, data, recipientId);
      setConversations(newState);
    },
    [setConversations, conversations]
  );

  const addMessageToConversation = useCallback(
    (data, recipientId) => {
      const newState = updateCurrentConv("current", conversations, data, recipientId);
      setConversations(newState);
    },
    [setConversations, conversations]
  );

  const resetUnreadMessage = (conversation) => {
    conversation.hasOwnProperty('user1')
      ? conversation.user1UnreadMsg = 0 :
      conversation.user2UnreadMsg = 0;
    const body = {
      id: conversation.id,
      user1UnreadMsg: conversation.user1UnreadMsg,
      user2UnreadMsg: conversation.user2UnreadMsg
    };
    axios.post('/api/conversations/resetUnreadMsgForCurrentUser', body);
  }

  const setActiveChat = (conversation) => {
    resetUnreadMessage(conversation);
    setActiveConversation(conversation.otherUser.username);
  };

  const addOnlineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, []);

  const removeOfflineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, []);

  // Lifecycle

  useEffect(() => {
    // Socket init
    socket.on('add-online-user', addOnlineUser);
    socket.on('remove-offline-user', removeOfflineUser);
    socket.on('new-message', addMessageToConversation);

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off('add-online-user', addOnlineUser);
      socket.off('remove-offline-user', removeOfflineUser);
      socket.off('new-message', addMessageToConversation);
    };
  }, [addMessageToConversation, addOnlineUser, removeOfflineUser, socket]);

  useEffect(() => {
    // when fetching, prevent redirect
    if (user?.isFetching) return;

    if (user && user.id) {
      setIsLoggedIn(true);
    } else {
      // If we were previously logged in, redirect to login instead of register
      if (isLoggedIn) history.push('/login');
      else history.push('/register');
    }
  }, [user, history, isLoggedIn]);

  useEffect(() => {
    if (!user.isFetching) {
      fetchConversations();
    }
  }, [user]);

  const handleLogout = async () => {
    if (user && user.id) {
      await logout(user.id);
    }
  };

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get('/api/conversations');
      setConversations(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer
          conversations={conversations}
          user={user}
          clearSearchedUsers={clearSearchedUsers}
          addSearchedUsers={addSearchedUsers}
          setActiveChat={setActiveChat}
        />
        <ActiveChat
          activeConversation={activeConversation}
          conversations={conversations}
          user={user}
          postMessage={postMessage}
        />
      </Grid>
    </>
  );
};

export default Home;
