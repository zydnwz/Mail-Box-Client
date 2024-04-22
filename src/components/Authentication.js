import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './Authentication.module.css';

const Authentication = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [login, setLogin] = useState(true);
    const [error, setError] = useState('');

    const emailHandler = (e) => {
        setEmail(e.target.value);
    };
    const passwordHandler = (e) => {
        setPassword(e.target.value);
    };
    const confirmPasswordHandler = (e) => {
        setConfirmPassword(e.target.value);
    };
    const switchHandler = () => {
        setLogin(!login);
    };

    const auth = async () => {
        if (confirmPassword !== password) {
            setError('Password and Confirm Password do not match');
            return;
        }
        const url = login
            ? 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA1RK_IQ3Z_CZ5xmOxuuYBXPOJJnwTJa6I'
            : 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA1RK_IQ3Z_CZ5xmOxuuYBXPOJJnwTJa6I';

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log(data);
            if (data.error) {
                setError(data.error.message);
            } else {
                setError('');
                alert('Login successful');
            }
        } catch (error) {
            console.log(error);
            setError('Something went wrong. Please try again later.');
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        auth();
    };

    return (
        <div className={classes.parent}>
            <div className={classes.container}>
                <Form onSubmit={submitHandler} className={classes.child1}>
                    <h3>{login ? 'Login' : 'Sign Up'}</h3>
                    <div className={classes.input}>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={emailHandler}
                            required
                        />
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={passwordHandler}
                            required
                        />
                        {!login && (
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={confirmPasswordHandler}
                                required
                            />
                        )}
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Button type="submit" variant="primary">
                        {login ? 'Login' : 'Sign Up'}
                    </Button>
                </Form>
            </div>
            <div className={classes.child2}>
                <Button type="button" variant="secondary" onClick={switchHandler}>
                    {login ? 'Create an Account' : 'Have an Account? Login'}
                </Button>
            </div>
        </div>
    );
};

export default Authentication;
