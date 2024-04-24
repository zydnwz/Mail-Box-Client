import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import classes from "./InboxMessage.module.css";
import Sidebar from "./Sidebar";
import { useInboxMessageApi } from "./useCustom"; 

const InboxMessage = () => {
  const { Identifier } = useParams();
  const arrayData = useSelector((state) => state.inboxReducer.inboxData);
  const Msg = arrayData.filter((msg) => msg.id === Identifier);
  const singlemsg = Msg[0].message;
  const user = Msg[0].from;
  const { markAsRead } = useInboxMessageApi(); 

  useEffect(() => {
    markAsRead(Identifier);
  }, [markAsRead, Identifier]);

  return (
    <div className={classes.parent}>
      <div className={classes.msg}>
        <p>From:- {user}</p>
        <p>Message:- {singlemsg}</p>
      </div>
    </div>
  );
};

export default InboxMessage;
