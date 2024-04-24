import React, { useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import classes from "./ComposeMail.module.css";
import Sidebar from "./Sidebar";
import { useMailApi } from "./useCustom"; 

const ComposeMail = () => {
  const { sendMail } = useMailApi();

  const [receiver, setReceiver] = useState('');
  const [subject, setSubject] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const receiverHandler = (e) => {
    setReceiver(e.target.value);
  }

  const subjectHandler = (e) => {
    setSubject(e.target.value);
  }

  const submitHandler = (e) => {
    e.preventDefault();
    sendMail(receiver, subject, editorState);
    setReceiver('');
    setSubject('');
    setEditorState(EditorState.createEmpty());
  };

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <Sidebar />
      </div>
      <div className={classes.parent}>
        <div className={classes.child1}>
          <div>To: </div>
          <input type="email" placeholder="email" value={receiver} onChange={receiverHandler}></input>
          <button type="button" className="btn btn-primary" onClick={submitHandler}>
            Send
          </button>
        </div>
        <div className={classes.child2}>
          <div>Subject: </div>
          <input type="text" value={subject} onChange={subjectHandler}></input>
        </div>
        <div className={classes.child3}>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
          />
        </div>
      </div>
    </div>
  );
};

export default ComposeMail;
