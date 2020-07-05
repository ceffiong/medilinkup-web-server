import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
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
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { indigo } from '@material-ui/core/colors';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link'
import Alert from '@material-ui/lab/Alert';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';


const mytextcolor = indigo["900"];


const api = axios.create({
    baseURL: process.env.REACT_APP_MY_HOST
})

function api_header(){
    const storedUser = JSON.parse(window.localStorage.getItem('login'));
    if(storedUser){
        const head_element = {
            headers: {
                Authorization: "Bearer " + storedUser.token
            }
        }
        return head_element
    }else{
        return null;
    }
}

function validateEmail(email){
    const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
    return re.test(String(email).toLowerCase());
}

const useStyles = makeStyles((theme) => ({
    root: {
        
    },
    formControl: {
        minWidth: 120,
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
  

const Signup = () => {
    const classes = useStyles();
    const history = useHistory();
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState('')
    const [cities, setCities] = useState([])
    const [city, setCity] = useState('')
    const [email, setEmail] =  useState('john.doe@gmail.com');
    const [password, setPassword] =  useState('password');
    const [passConfirmed, setPassConfirmed] = useState('');
    //backdrop
    const [open, setOpen] = React.useState(false);
    //error
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])
    const [showform, setShowform] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [success, setSuccess] = useState(false)

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


    const [valuesP, setValuesP] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    const handleClickShowPasswordP = () => {
        setValuesP({ ...valuesP, showPassword: !valuesP.showPassword });
    };

    const handleMouseDownPasswordP = (event) => {
        event.preventDefault();
    };


    const handleSignUp = (e) => {
        e.preventDefault();
        setOpen(true)
        let errMsg = []
        if(fname == undefined || fname.length < 2 || fname == ''){
            errMsg.push("Please enter first name")
        }

        if(lname == undefined || lname.length < 2 || lname == ''){
            errMsg.push("Please enter last name")
        }

        if(country == undefined || country == ''){
            errMsg.push("Please select your country")
        }

        if(city == undefined || city == ''){
            errMsg.push("Please select your city")
        }

        if(email === "" || validateEmail(email) == false){
            errMsg.push("Please enter a valid email")
        }

        if((password != undefined || password != '') && (passConfirmed != undefined || passConfirmed != "")){
            if(passConfirmed === password){
                if(password.length < 8 || passConfirmed.length < 8){
                    errMsg.push("Passwords length must be at least 8 characters")
                }
                if (/\s/.test(password)) {
                    errMsg.push("Passwords cannot containe whitespace(s)")
                }

            }else{
                errMsg.push("Passwords MUST match")
            }
        }else{
            errMsg.push("Password fields cannot be blank")
        }

        if(errMsg.length < 1){
            const dataToAdd = {
                name: {
                    first_name: fname,
                    last_name: lname
                },
                contact: {
                    email: email,
                    country: country, 
                    city: city,
                },
                password: password,
                activated: false,
                created_at: new Date(),
                updated_at: new Date()
            }

            api.post("/healthworkers/signup", dataToAdd, api_header())
                .then(res => {
                    setTimeout(() => {
                        setOpen(false)
                        setSuccess(true)
                        setIserror(false)
                        setSuccessMessage("Congratulations!!! Your account is successfully created and we have sent you an email. Please note that it we'll need to confirm that you are a health official before Activating your account")
                    }, 500)
                })
                .catch(error => {
                    setIserror(true)
                    setSuccess(false)
                    setOpen(false)

                    if(error.response && error.response.data.message == "Mail exists"){
                        setErrorMessages(["Account with this email already exist! Please choose another email or recover account (if you have forgotten your password)"])
                    }else{
                        setErrorMessages(["Error creating account. Please try again later or contact Admin if error persists"])
                    }
                })
        }else{
            setErrorMessages(errMsg)
            setIserror(true)
            setOpen(false)
        }
        
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
    
      useEffect(() => {
        setOpen(true)
        api.get("/countries", api_header())
            .then(res => {                  
                const countryObj = res.data
                const countryList = []
                countryObj.forEach(item => {
                    countryList.push(item.name)
                });
                setCountries(countryList)
                setIserror(false)
                setErrorMessages([])
                setTimeout(() => {
                    setOpen(false)
                }, 500);
             })
             .catch(error=>{
                setIserror(true)
                setErrorMessages(["Could not load countries. Try again later and contact admin if problem persist"])
                setOpen(false)
             })
    }, [])

    useEffect(() => { 
        setOpen(true)
        if(country){
            api.get("/countries/"+country)
            .then(res => {
                setCities(res.data.cities.sort())
                //change city value if the city is not in the selected country
                if(! res.data.cities.includes(city)){
                    setCity(res.data.cities[0])
                }
                setIserror(false)
                setErrorMessages([])

                setTimeout(() => {
                    setOpen(false)
                }, 100);

                
            })
            .catch(error=>{
                setIserror(true)
                setErrorMessages(["Could not load cities. Try again later and contact admin if problem persist"])
                setOpen(false)

            })
        }
    }, [country])


    return ( 
        <div className={classes.root}>
            {showform &&
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={3}></Grid>
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
                                    {errorMessages.map((msg, i) => {
                                        return <div key={i}>{msg}</div>
                                    })}
                                </Alert>
                            }

                            {success && 
                                <Alert severity="success">
                                    {successMessage}
                                </Alert>
                            }
                            
                        </div>

                        <h1 style={{color: mytextcolor}}>Sign Up</h1>
                    
                        <Divider />
                        <p>Create an Account to get a bird's eye view of patients accross countries</p>
                        <Divider />
                        <form>

                            <Grid container style={{marginTop: 10, marginBottom: 20}} spacing={2}>
                                <Grid item xs={6}>
                                    <TextField required={true} fullWidth={true} className={clsx(classes.margin, classes.textField)} id="outlined-basic" label="First name" variant="outlined" value={fname} onChange={(e) => setFname(e.target.value)}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField required={true} fullWidth={true} className={clsx(classes.margin, classes.textField)} id="outlined-basic" label="Last name" variant="outlined" value={lname} onChange={(e) => setLname(e.target.value)}/>
                                </Grid>
                            </Grid>
                            <TextField style={{marginTop: 0, marginBottom: 10}} helperText="We'll never share your email" required={true} fullWidth={true} className={clsx(classes.margin, classes.textField)} id="outlined-basic" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            

                            <Grid container style={{marginTop: 0, marginBottom: 20}} spacing={2}>
                                <Grid item xs={6}>
                                    <Autocomplete
                                        value={country}
                                        onChange={(e, newValue) => setCountry(newValue)}
                                        id="combo-box-country"
                                        options={countries}
                                        style={{width: "100%"}}
                                        getOptionLabel={(option) => option}
                                        renderInput={(params) => <TextField d="outlined-basic" label="Country" variant="outlined" {...params}  />}
                                    />

                                </Grid>
                                <Grid item xs={6}>
                                    <Autocomplete
                                        value={city}
                                        onChange={(e, newValue) => setCity(newValue)}
                                        id="combo-box-city"
                                        options={cities}
                                        style={{width: "100%"}}
                                        getOptionLabel={(option) => option}
                                        renderInput={(params) => <TextField d="outlined-basic" label="City" variant="outlined" {...params}  />}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
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
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl style={{marginBottom: 30}} fullWidth={true} className={clsx(classes.margin, classes.textField)} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Re-password</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={valuesP.showPassword ? 'text' : 'password'}
                                            value={passConfirmed}
                                            onChange={(e) => setPassConfirmed(e.target.value)}
                                            required={true}
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPasswordP}
                                                onMouseDown={handleMouseDownPasswordP}
                                                edge="end"
                                                >
                                                {valuesP.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                            labelWidth={100}
                                        />
                                        
                                    </FormControl>
                                    
                                </Grid>
                            </Grid>

                            <p style={{marginBottom: 20}}>By clicking Sign In, you agree to our Terms of Use and our Privacy Policy.</p>
                            <Button fullWidth={true} variant="contained" color="primary" onClick={handleSignUp}>Sign Up</Button>
                            <p style={{marginBottom: 20, fontWeight: "bold"}}>Forgot your password?</p>
                            <p onClick={() => console.log("what")} style={{marginBottom: 30, fontSize: "medium", fontWeight: "bold"}}>
                                
                                <Link href="#" onClick={() => history.push("/login")}>
                                Already have an account? Login here!
                                </Link>
                            </p>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={3}></Grid>
            </Grid>
            }
        </div>
    );
}
 
export default Signup;