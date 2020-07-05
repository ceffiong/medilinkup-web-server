import React, { useContext, useState }  from 'react';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
import { useHistory } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { LoginContext } from '../../context/LoginContext';


export default function SignedOut() {
    const history = useHistory();
    const {dispatch } = useContext(LoginContext); //for login out
    const handleRedirect = () => {
        dispatch({type: 'LOGOUT'});
        history.push("/login")
    }
    return (
        <div style={{textAlign: "center"}}>
            <p>
                <LockIcon style={{ color: "grey", fontSize: 150 }} />
            </p>
            <h1 style={{padding:10, color: 'rgba(245, 0, 87, 1)'}}>Session expired</h1>
            <p style={{fontSize: "large"}}>
                You have been logged out due to inactivity. {<Button onClick={handleRedirect} color="primary"><b style={{fontSize: "large"}}>SIGN IN</b></Button>} again!
            </p>
            <Divider />
            <p>
                <div>Unauthorize use of the application is prohibit and subject to {<b>prosecution by law</b>}</div>
                <div style={{marginTop: "50px", color: "grey"}}>
                    &copy; Copyright {new Date().getFullYear()}  All rights reserved!
                </div>
            </p>
        </div>
    )
}
