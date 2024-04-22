import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { AuthActions } from '../Store/AuthReducer';
import classes from './Authentication.module.css';

const Authentication = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [login, setLogin] = useState(true);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

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

    let url;
    const auth = async () => {
        if (confirmPassword !== password) {
            return setError('Password and Confirm Password do not match');
        }
        if (login) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA1RK_IQ3Z_CZ5xmOxuuYBXPOJJnwTJa6I';
        } else {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA1RK_IQ3Z_CZ5xmOxuuYBXPOJJnwTJa6I';
        }
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
                return setError(data.error.message);
            }
            setError('');
            alert('Login successful');
            dispatch(AuthActions.login());
        } catch (error) {
            console.log(error);
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
                    <h3>Login</h3>
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
                        <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={confirmPasswordHandler}
                            required
                        />
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Button type="submit" variant="primary">
                        {login ? 'Login' : 'Sign Up'}
                    </Button>
                </Form>
            </div>
            <div className={classes.child2}>
                <Button type="button" variant="secondary" onClick={switchHandler}>
                    {login ? 'Create Account' : 'Have an Account? Login'}
                </Button>
            </div>
        </div>
    );
};

export default Authentication;
