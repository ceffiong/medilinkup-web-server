import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContext';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { indigo } from '@material-ui/core/colors';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link'
import Alert from '@material-ui/lab/Alert';


const mytextcolor = indigo["900"];

const api = axios.create({
  baseURL: process.env.REACT_APP_MY_HOST
})

  const useStyles = makeStyles((theme) => ({
    root: {
        
    },
    control: {
      padding: theme.spacing(5),
      textAlign: "center",
      margin: theme.spacing(5)
    },
    textcolor: {
      color: mytextcolor
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },

  }));
  

const Login = () => {
    const classes = useStyles();
    const { dispatch } = useContext(LoginContext);
    const[email, setEmail] =  useState('john.doe@gmail.com');
    const[password, setPassword] =  useState('password');
    const history = useHistory();
    //backdrop
    const [open, setOpen] = React.useState(false);
    //error
    const [iserror, setIserror] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [showform, setShowform] = useState(false)

    const [values, setValues] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });
  
    const handleClickShowPassword = () => {
      setValues({ ...values, showPassword: !values.showPassword });
    };
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setOpen(true)
        api.post('/healthworkers/login', {contact: {email: email}, password: password})
            .then(res => {
                //store login details in local storage
                dispatch({type: 'LOGIN', healthworker:{login: true, id: res.data._id, token: res.data.token, fname: res.data.fname, lname: res.data.lname}});
                setIserror(false)
                setErrorMessage("")

                //get healthwork and patient count
                const userToken = {
                  headers: {
                    Authorization: "Bearer " + res.data.token
                  }
                }

                setTimeout(() => {
                  setEmail('');
                  setPassword('');
                  history.push("/dashboard/"+res.data._id)
              }, 500);

                
             })
             .catch(error => {
                dispatch({type: 'LOGOUT'});
                
                setTimeout(() => {
                  setOpen(false)
                  setIserror(true)

                  if(error.response && error.response.data.message === "Not activated"){
                    setErrorMessage("Your account is not Activated yet. Activation process is ongoing and you'll be informed by email when your account is activated")
                  }else{
                    setErrorMessage("Auth failure! Please create an account or consider recovering your password.")
                  }
                  
                }, 500);
                
             })
    }

    const handleSignUpClicked = (e) => {
      e.preventDefault();
      history.push("/signup")
    }

    useEffect(() => {
      const storedUser = JSON.parse(window.localStorage.getItem('login'));
      if(storedUser){
        setShowform(false)
        history.push("/dashboard/"+storedUser.id)
      }else{
        setShowform(true)
      }
    }, [])

    return ( 
        <div className={classes.root}>
            {showform &&
            <Grid container className={classes.root} spacing={2}>
            
              <Grid item xs={3}>
                
              <p>
              </p>
              </Grid>

              <Grid item xs={6}>
            
              <div>
                <Backdrop className={classes.backdrop} open={open}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </div>

              <Paper className={classes.control}>
                <div>
                  {iserror && 
                      <Alert severity="error">
                          {errorMessage}
                      </Alert>
                  }
                  
                </div>

                <h1 style={{color: mytextcolor}}>Sign in to your account</h1>
                
                <Divider />
                <p>Get a bird's eye view on patients across countries</p>
                <Divider />
                <form>
                  <TextField style={{marginTop: 30, marginBottom: 30}} required={true} fullWidth={true} className={clsx(classes.margin, classes.textField)} id="outlined-basic" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  <FormControl style={{marginBottom: 30}} fullWidth={true} className={clsx(classes.margin, classes.textField)} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                      <OutlinedInput
                          id="outlined-adornment-password"
                          type={values.showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required={true}
                          endAdornment={
                          <InputAdornment position="end">
                              <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              >
                              {values.showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                          </InputAdornment>
                          }
                          labelWidth={70}
                      />
                      <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                  </FormControl>
                  <p style={{marginBottom: 30}}>By clicking Sign In, you agree to our Terms of Use and our Privacy Policy.</p>
                  <Button fullWidth={true} variant="contained" color="primary" onClick={handleLogin}>Sign In</Button>
                  <p style={{marginBottom: 30, fontWeight: "bold"}}>Forgot your password?</p>
                  <p onClick={handleSignUpClicked} style={{marginBottom: 30, fontSize: "medium", fontWeight: "bold"}}>
                    
                    <Link href="#" onClick={handleSignUpClicked}>
                      Don't have an account? Sign up!
                    </Link>
                  </p>
                </form>
                </Paper>
                
              </Grid>

              <Grid item xs={3}>
              <p></p>
              </Grid>
              
            </Grid>
          }
        </div>
    );
}
 
export default Login;