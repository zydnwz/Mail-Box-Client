import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import classes from "./InboxMessage.module.css";
import Sidebar from "./Sidebar";

const InboxMessage = () => {
  const { Identifier } = useParams();
  const arrayData = useSelector((state) => state.inboxReducer.inboxData);
  const [singlemsg, setSingleMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetchMessageData();
        if (response.ok) {
          const messageData = await response.json();
          setSingleMsg(messageData.message);
          await markMessageAsRead();
        } else {
          throw new Error("Failed to fetch message data");
        }
      } catch (error) {
        console.error("Error fetching message:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [Identifier]);

  const fetchMessageData = async () => {
    const url = `https://mail-box-client-8e420-default-rtdb.firebaseio.com/Inbox/${localStorage.getItem("email").replace(/['@','.']/g, "")}/${Identifier}.json`;
    return await fetch(url);
  };

  const markMessageAsRead = async () => {
    const url = `https://mail-box-client-8e420-default-rtdb.firebaseio.com/Inbox/${localStorage.getItem("email").replace(/['@','.']/g, "")}/${Identifier}.json`;
    await fetch(url, {
      method: "PATCH",
      body: JSON.stringify({
        read: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  if (loading) {
    return (
      <div className={classes.parent}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className={classes.parent}>
      <div className={classes.msg}>
        <p>{singlemsg}</p>
      </div>
    </div>
  );
};

export default InboxMessage;
