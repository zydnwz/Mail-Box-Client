import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AuthActions } from '../Store/AuthReducer';
import { InboxActions } from '../Store/InboxReducer';
import classes from './Sidebar.module.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const unread = useSelector(state => state.inboxReducer.unread);
  const getRequest = useSelector(state => state.inboxReducer.getReq);
  const [render, setRender] = useState(true);

  const fetchNewMails = async () => {
    let url = "https://mail-box-client-8e420-default-rtdb.firebaseio.com";
    const email = localStorage.getItem("email");
    const emailFormatted = email ? email.replace(/['@','.']/g, "") : '';
    
    try {
      const response = await fetch(`${url}/Inbox/${emailFormatted}.json`);
      const data = await response.json();
      let arrayOfData = [];
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
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchNewMails();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const logoutHandler = () => {
    dispatch(AuthActions.logout());
  };

  return (
    <div className={classes.container}>
      <div>All Mails</div>
      <div clasName={classes.button}>
        <Link to='/'><button type="submit" className="btn btn-success" style={{ marginTop: '20px', width: '130px' }}>Compose Mail</button></Link>
        <Link to='/Inbox'><button type="submit" className="btn btn-success" style={{ marginTop: '20px', width: '130px' }}>Inbox</button>{unread}</Link>
        <Link to='/SentBox'><button type="submit" className="btn btn-success" style={{ marginTop: '20px', width: '130px' }}>Sent Box</button></Link>
        <button type="button" className="btn btn-success" style={{ marginTop: '20px', width: '130px' }} onClick={logoutHandler}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
