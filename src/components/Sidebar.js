import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AuthActions } from '../Store/AuthReducer';
import classes from './Sidebar.module.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const unread = useSelector(state => state.inboxReducer.unread);

  const logoutHandler = () => {
    dispatch(AuthActions.logout());
  };

  return (
    <div className={classes.container}>
      <div>All Mails</div>
      <div className={classes.button}>
        <Link to="/"><button type="submit" className="btn btn-success" style={{ marginTop: '20px', width: '130px' }}>Compose Mail</button></Link>
        <Link to="/Inbox"><button type="submit" className="btn btn-success" style={{ marginTop: '20px', width: '130px' }}>Inbox ({unread})</button></Link>
        <button type="button" className="btn btn-success" style={{ marginTop: '20px', width: '130px' }} onClick={logoutHandler}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
