import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import classes from './SentboxMessage.module.css';
import { useSentboxMessage } from './useCustom'; 

const SentboxMessage = () => {
  const { Identifier } = useParams();
  const { getMessage } = useSentboxMessage(Identifier); 

  const { user, message } = getMessage();

  return (
    <div className={classes.parent}>
      <div className={classes.msg}>
        <p>To:- {user}</p>
        <p>Message:- {message}</p>
      </div>
    </div>
  );
}

export default SentboxMessage;
