import React, { useState } from 'react';
import { Button } from 'react-bootstrap'; 
import classes from './WelcomeScreen.module.css';
import ComposeMail from './ComposeMail';

const WelcomeScreen = () => {
  const [showComposeMail, setShowComposeMail] = useState(false);

  const handleComposeClick = () => {
    setShowComposeMail(true);
  };

  return (
    <div>
      <div className={classes.parent}>Welcome to Mail Box!!!</div>
      <div className={classes.line}></div>
      {!showComposeMail && (
        <Button variant="primary" onClick={handleComposeClick}>Compose</Button>
      )}
      {showComposeMail && <ComposeMail />}
    </div>
  );
};

export default WelcomeScreen;
