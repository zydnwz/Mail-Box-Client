import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AuthActions } from '../ReduxStore/AuthReducer';
import { InboxActions } from '../ReduxStore/InboxReducer';
import classes from './Sidebar.module.css';
import { useMailboxData } from './useCustom'; 

const Sidebar = () => {
  const dispatch = useDispatch();
  const unread = useSelector(state => state.inboxReducer.unread);
  const [render, setRender] = useState(true);
  const { fetchMailboxData } = useMailboxData(setRender); 

  const logoutHandler = () => {
    dispatch(AuthActions.logout());
  };

  useEffect(() => {
    const id = setInterval(() => {
      setRender(!render);
    }, 2000);

    return () => {
      clearInterval(id);
    };
  }, [render]);

  useEffect(() => {
    fetchMailboxData();
  }, [fetchMailboxData, render]);

  return (
    <div className={classes.container}>
      <div className={classes.button}>
        <Link to="/"><button type="submit" className="btn btn-success" style={{ marginTop: '20px', width: '130px' }}>Compose Mail</button></Link>
        <Link to="/Inbox"><button type="submit" className="btn btn-success" style={{ marginTop: '20px', width: '130px' }}>Inbox{unread > 0 && ` (${unread})`}</button></Link>
        <Link to="/SentBox"><button type="submit" className="btn btn-success" style={{ marginTop: '20px', width: '130px' }}>Sent Box</button></Link>
        <button type="button" className="btn btn-success" style={{ marginTop: '20px', width: '130px' }} onClick={logoutHandler}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
