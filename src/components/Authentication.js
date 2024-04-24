import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AuthActions } from '../ReduxStore/AuthReducer';
import { useApi } from './useCustom'; 
import { Form, Button } from 'react-bootstrap';
import classes from './Authentication.module.css';

const Authentication = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [login, setLogin] = useState(true);
    const dispatch = useDispatch();

    const { loading, error, sendRequest } = useApi(); 

    const emailHandler = (e) => {
        setEmail(e.target.value);
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value);
    }

    const confirmPasswordHandler = (e) => {
        setConfirmPassword(e.target.value);
    }

    const switchHandler = () => {
        setLogin(!login);
    }

    const auth = async () => {
        if (confirmPassword !== password) {
            return alert('Password and Confirm Password do not match');
        }
        const url = login
            ? 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA1RK_IQ3Z_CZ5xmOxuuYBXPOJJnwTJa6I'
            : 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA1RK_IQ3Z_CZ5xmOxuuYBXPOJJnwTJa6I';
        try {
            const responseData = await sendRequest(url, 'POST', {
                email: email,
                password: password,
                returnSecureToken: true,
            });
            console.log(responseData);
            if (error) {
                return alert(error);
            }
            alert('Login successful');
            dispatch(AuthActions.login());
            localStorage.setItem('email', email);
        } catch (error) {
            console.log(error);
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        auth();
    }

    return (
        <div className={classes.parent}>
            <div className={classes.container}>
                <Form onSubmit={submitHandler} className={classes.child1}>
                    <h3>{login ? 'Login' : 'Sign Up'}</h3>
                    <div className={classes.input}>
                        <Form.Control type="email" placeholder='Email' value={email} onChange={emailHandler} required />
                        <Form.Control type="password" placeholder='Password' value={password} onChange={passwordHandler} required />
                        <Form.Control type="password" placeholder='Confirm Password' value={confirmPassword} onChange={confirmPasswordHandler} required />
                    </div>
                    <Button variant="primary" type="submit">
                        {login ? 'Login' : 'Sign Up'}
                    </Button>
                </Form>
            </div>
            <div className={classes.child2}>
                <Button variant="secondary" onClick={switchHandler}>
                    {login ? 'Create Account' : 'Have an Account? Login'}
                </Button>
            </div>
        </div>
    )
}

export default Authentication;
