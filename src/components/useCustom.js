import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import { InboxActions } from '../ReduxStore/InboxReducer';
import { sentBoxActions } from '../ReduxStore/SentBoxReducer';
import { useCallback } from 'react';

export const useMailboxData = (setRender) => {
  const dispatch = useDispatch();
  const getRequest = useSelector(state => state.inboxReducer.getReq);

  const fetchMailboxData = async () => {
    try {
      const url = 'https://mail-box-client-8e420-default-rtdb.firebaseio.com';
      const email = localStorage.getItem('email').replace(/['@','.']/g, '');
      const response = await fetch(`${url}/Inbox/${email}.json`);
      const data = await response.json();
      const arrayOfData = [];
      for (let key in data) {
        arrayOfData.unshift({ id: key, ...data[key] });
      }
      dispatch(InboxActions.changeInbox(arrayOfData));
      let count = 0;
      arrayOfData.forEach((msg) => {
        if (msg.read === false) {
          count++;
        }
      });
      dispatch(InboxActions.updateUnread(count));
    } catch (error) {
      console.log(error);
    } finally {
      setRender((prevRender) => !prevRender);
    }
  };

  return { fetchMailboxData };
};

export const useSentboxMessage = (Identifier) => {
  const dataSentbox = useSelector(state => state.sentBoxReducer.dataSentbox);

  const getMessage = () => {
    const singleMessage = dataSentbox.find(msg => msg.id === Identifier);
    const user = singleMessage ? singleMessage.to : '';
    const message = singleMessage ? singleMessage.message : '';
    return { user, message };
  };

  return { getMessage };
};

export const useSentBoxApi = () => {
  const dispatch = useDispatch();
  const email = localStorage.getItem('email').replace(/['@','.']/g, '');
  const url = 'https://mail-box-client-8e420-default-rtdb.firebaseio.com';

  const fetchSentBoxData = async () => {
    try {
      const response = await fetch(`${url}/sentBox/${email}.json`);
      const data = await response.json();

      const arrayData = [];
      for (let key in data) {
        arrayData.unshift({ id: key, ...data[key] });
      }
      dispatch(sentBoxActions.updateSentbox(arrayData));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await fetch(`${url}/sentBox/${email}/${id}.json`, {
        method: 'DELETE'
      });
      fetchSentBoxData();
    } catch (error) {
      console.log(error);
    }
  };

  return { fetchSentBoxData, deleteMessage };
};

export const useInboxMessageApi = () => {
  const email = localStorage.getItem('email').replace(/['@','.']/g, '');
  const url = 'https://mail-box-client-8e420-default-rtdb.firebaseio.com';

  const markAsRead = async (id) => {
    try {
      await fetch(`${url}/Inbox/${email}/${id}.json`, {
        method: 'PATCH',
        body: JSON.stringify({
          read: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return { markAsRead };
};

export const useInboxApi = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const email = localStorage.getItem('email').replace(/['@','.']/g, '');
  const url = 'https://mail-box-client-8e420-default-rtdb.firebaseio.com';

  const fetchInboxData = async () => {
    try {
      const response = await fetch(`${url}/Inbox/${email}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch inbox data');
      }
      const data = await response.json();
      const inboxData = data ? Object.values(data) : [];
      dispatch(InboxActions.updateInbox(inboxData));
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await fetch(`${url}/Inbox/${email}/${id}.json`, {
        method: 'DELETE'
      });
      dispatch(InboxActions.updateGet());
    } catch (error) {
      setError(error.message);
    }
  };

  return { error, fetchInboxData, deleteMessage };
};

export const useMailApi = () => {
  const [error, setError] = useState(null);
  const url = 'https://mail-box-client-8e420-default-rtdb.firebaseio.com';
  const sender = localStorage.getItem('email').replace(/['@','.']/g, '');
  const sender1 = localStorage.getItem('email');

  const postDatatoSentBox = async (receiver, subject, message) => {
    try {
      await fetch(`${url}/sentBox/${sender}.json`, {
        method: 'POST',
        body: JSON.stringify({
          to: receiver,
          subject: subject,
          message: message.getCurrentContent().getPlainText()
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      setError(error.message);
    }
  }

  const postDataToInbox = async (receiver, subject, message) => {
    const receiver1 = receiver.replace(/['@','.']/g, '');
    try {
      await fetch(`${url}/Inbox/${receiver1}.json`, {
        method: 'POST',
        body: JSON.stringify({
          from: sender1,
          subject: subject,
          message: message.getCurrentContent().getPlainText(),
          read: false
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      setError(error.message);
    }
  }

  const sendMail = (receiver, subject, editorState) => {
    postDatatoSentBox(receiver, subject, editorState);
    postDataToInbox(receiver, subject, editorState);
  };

  return { error, sendMail };
};

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error.message || 'Something went wrong!');
      }
      setError(null);
      return responseData;
    } catch (error) {
      setError(error.message || 'Something went wrong!');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, sendRequest };
};

