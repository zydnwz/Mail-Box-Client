import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import classes from './SentBox.module.css';
import { useSentBoxApi } from "./useCustom"; 

const SentBox = () => {
  const dispatch = useDispatch();
  const sentBoxData = useSelector((state) => state.sentBoxReducer.dataSentbox);
  const { fetchSentBoxData, deleteMessage } = useSentBoxApi(); 

  useEffect(() => {
    fetchSentBoxData();
  }, [fetchSentBoxData]);

  const deleteHandler = (id) => {
    deleteMessage(id);
  };

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <Sidebar />
      </div>
      <div className={classes.tableParent}>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">To</th>
              <th scope="col">Subject</th>
              <th scope="col">Message</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {sentBoxData.map((item, index) => {
              return (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.to}</td>
                  <td>{item.subject}</td>
                  <td><Link to={`/Sentbox/${item.id}`}>Open Message</Link></td>
                  <td><button type="button" className="btn btn-danger" onClick={() => deleteHandler(item.id)}>delete</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SentBox;
