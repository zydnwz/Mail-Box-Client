import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { InboxActions } from "../Store/InboxReducer";
import classes from "./Inbox.module.css";
import Sidebar from "./Sidebar";

const Inbox = () => {
  const dispatch = useDispatch();
  const inboxData = useSelector((state) => state.inboxReducer.inboxData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetchInboxData();
      if (!response.ok) {
        throw new Error("Failed to fetch inbox data");
      }
      const data = await response.json();
      const formattedData = formatData(data);
      dispatch(InboxActions.changeInbox(formattedData));
      const unreadCount = countUnreadMessages(formattedData);
      dispatch(InboxActions.updateUnread(unreadCount));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInboxData = async () => {
    const email = localStorage.getItem("email").replace(/['@','.']/g, "");
    const url = `https://mail-box-client-8e420-default-rtdb.firebaseio.com/Inbox/${email}.json`;
    return await fetch(url);
  };

  const formatData = (data) => {
    return Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
  };

  const countUnreadMessages = (data) => {
    return data.reduce((count, msg) => (msg.read ? count : count + 1), 0);
  };

  const deleteMessage = async (id) => {
    try {
      const response = await fetchDeleteMessage(id);
      if (!response.ok) {
        throw new Error("Failed to delete message");
      }
      fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchDeleteMessage = async (id) => {
    const email = localStorage.getItem("email").replace(/['@','.']/g, "");
    const url = `https://mail-box-client-8e420-default-rtdb.firebaseio.com/Inbox/${email}/${id}.json`;
    return await fetch(url, {
      method: "DELETE",
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={classes.parent}>
      <div className={classes.sidebar}>
        <Sidebar />
      </div>
      <div className={classes.tableParent}>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">From</th>
              <th scope="col">Subject</th>
              <th scope="col">Message</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {inboxData.map((item, index) => (
              <tr key={item.id}>
                <td scope="row">{index + 1}</td>
                <td>
                  {!item.read && (
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "100%",
                        backgroundColor: "blue",
                      }}
                    ></div>
                  )}
                  {item.from}
                </td>
                <td>{item.subject}</td>
                <td>
                  <Link to={`/Inbox/${item.id}`}>Open Message</Link>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteMessage(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inbox;
