import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { InboxActions } from "../ReduxStore/InboxReducer";
import classes from "./Inbox.module.css";
import Sidebar from "./Sidebar";
import { useInboxApi } from "./useCustom";

const Inbox = () => {
  const dispatch = useDispatch();
  const inboxData = useSelector((state) => state.inboxReducer.inboxData);
  const { fetchInboxData, deleteMessage } = useInboxApi(); 

  useEffect(() => {
    fetchInboxData();
  }, [fetchInboxData]);

  const deleteHandler = (id) => {
    deleteMessage(id);
  };

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
                      onClick={() => deleteHandler(item.id)}
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
