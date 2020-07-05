import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import PatientsChart from '../healthworkers/charts/PatientsChart'
import HealthworkersChart from '../healthworkers/charts/HealthworkersChart'
import PatientCitiesChart from '../healthworkers/charts/PatientCitiesChart'
import Grid from '@material-ui/core/Grid';
import NativeSelect from '@material-ui/core/NativeSelect';
import Divider from '@material-ui/core/Divider';



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

const useStyles = makeStyles((theme) => ({
    root: {
        
      },
  }));

function Dashboard({ match }){

    const classes = useStyles();
    const [patients, setPatients] = useState([])
    const [healthworkers, setHealthworkers] = useState([])
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState('Nigeria')
    const [cities, setCities] = useState([])

    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    //backdrop
    const [open, setOpen] = useState(false);
    const [opencity, setOpencity] = useState(false);


    useEffect(() => {
        setOpencity(true)
        
        const selectedCountry = country
        //setCountry(event.target.value)
        let cityList = []
        let patientCities = []

        api.get("/countries/"+country)
            .then(res => {
                cityList = res.data.cities
                return api.get("patients/countries/"+country, api_header())
            })
            .then(res => {
                const returnedPatientCities = res.data.patients //list of patients cities for the selected country

                const frequency = new Map([...new Set(returnedPatientCities)].map(
                    x => [x, returnedPatientCities.filter(y => y === x).length]
                ));

                for (let i = 0; i < cityList.length; i++) {
                    let city = cityList[i]
                    let patient = frequency.get(cityList[i])
                    if(patient === undefined){
                        patient = 0
                    }

                    const freq = {
                        city: city,
                        patient: patient,
                    }
                    patientCities.push(freq)
                }

                setCities(patientCities)
                

                setTimeout(() => {
                    setIserror(false)
                    setErrorMessages([])
                    setOpencity(false)
                }, 100);
            })
            .catch(error=>{

                setIserror(true)
                setErrorMessages(["Could not load data. Try again later and contact admin if problem persist"])
                setOpencity(false)

            })
    }, [country])

    useEffect(() => {
        setOpen(true)
        let countryList = []
        let patientCountries = []
        let healthworkerCountries = []
        let patientCountryFreq = []
        let healthworkerCountryFreq = []

        api.get("/countries", api_header())
            .then(res => {
                setCountries(res.data)
                setCountry(res.data[0].name)
                res.data.forEach(country => {
                    countryList.push(country.name)
                });
                return api.get("/patients", api_header());
            })
            .then(res => {
                res.data.patients.forEach(patient => {
                    patientCountries.push(patient.contact.country)
                });
                return api.get("/healthworkers", api_header());
            })
            .then(res=>{  //healthworker result

                //create patient data
                const frequency = new Map([...new Set(patientCountries)].map(
                    x => [x, patientCountries.filter(y => y === x).length]
                ));
                for (let i = 0; i < countryList.length; i++) {
                    let country = countryList[i]
                    let patient = frequency.get(countryList[i])
                    if(patient === undefined){
                        patient = 0
                    }

                    const freq = {
                        country: country,
                        patient: patient,
                    }
                    patientCountryFreq.push(freq)
                }
                setPatients(patientCountryFreq)
                

                //create healthworker data
                res.data.healthworkers.forEach(hw => {
                    healthworkerCountries.push(hw.contact.country)
                });

                const frequencyHw = new Map([...new Set(healthworkerCountries)].map(
                    x => [x, healthworkerCountries.filter(y => y === x).length]
                ));
                
                //copy previous data
                healthworkerCountryFreq = [...patientCountryFreq]
                for (let i = 0; i < countryList.length; i++) {
                    let healthworker = frequencyHw.get(countryList[i])
                    if(healthworker === undefined){
                        healthworker = 0
                    }

                    healthworkerCountryFreq[i].healthworker = healthworker;
                }
                setHealthworkers(healthworkerCountryFreq)
                setTimeout(() => {
                    setOpen(false)
                    setIserror(false)
                    setErrorMessages([])
                }, 500)
            })
            .catch(err => {
                setOpen(false)
                setIserror(true)
                setErrorMessages(["Could not load data. Try again later and contact admin if problem persist"])
            })
        
       
    }, [])
    
    return (
        <div className={classes.root}>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div>
                {iserror && 
                    <Alert severity="error">
                        {errorMessages.map((msg, i) => {
                            return <div key={i}>{msg}</div>
                        })}
                    </Alert>
                }
                        
            </div>

            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={6}>
                    {!open &&
                        
                        <PatientsChart patients = {patients} />
                    }
                </Grid>
                <Grid item xs={6}>
                    {!open &&
                        <HealthworkersChart healthworkers = {healthworkers} />
                    }
                </Grid>

            </Grid>

            <Divider style={{margin: 20}} />

            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                {!open &&
                    <div style={{textAlign: "center"}}>
                    
                    <NativeSelect
                        style={{ width: 200}}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        >
                            {countries.map((item) => {
                                return <option key={item._id} value={item.name}>{item.name}</option>
                            })}
                            
                    </NativeSelect>
                    
                   
                   
                        <PatientCitiesChart cities = {cities} /> 
                        </div>
                    }
                    
                
                    
                        
                    
                </Grid>
                
            </Grid>
        </div>
    )
}
 
export default Dashboard;


