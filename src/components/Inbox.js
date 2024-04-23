import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { InboxActions } from "../Store/InboxReducer";
import classes from "./Inbox.module.css";
import Sidebar from "./Sidebar";

const Inbox = () => {
  const dispatch = useDispatch();
  const inboxData = useSelector((state) => state.inboxReducer.inboxData);

  const fetchNewMails = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) return; 

      const emailFormatted = email.replace(/['@','.']/g, "");
      const response = await fetch(
        `https://mail-box-client-8e420-default-rtdb.firebaseio.com/Inbox/${emailFormatted}.json`
      );
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

  const deleteData = async (id) => {
    try {
      const email = localStorage.getItem("email");
      if (!email) return; 

      const response = await fetch(
        `https://mail-box-client-8e420-default-rtdb.firebaseio.com/Inbox/${email}/${id}.json`,
        {
          method: "DELETE",
        }
      );
      dispatch(InboxActions.updateGet());
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = (id) => {
    deleteData(id);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchNewMails();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

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
              <th scope="col">From </th>
              <th scope="col">Subject </th>
              <th scope="col">Message </th>
              <th scope="col">Delete </th>
            </tr>
          </thead>
          <tbody>
            {inboxData.map((item, index) => {
              return (
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
                      onClick={deleteHandler.bind(null, item.id)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inbox;
