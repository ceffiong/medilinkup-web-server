import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import axios from 'axios'
import MaterialTable from "material-table";
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { set } from 'date-fns';
import Alert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LoginContext } from '../../context/LoginContext';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';



const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };


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
        margin: theme.spacing(5)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

  }));

function Bio({match}){

    const classes = useStyles();
    const history = useHistory();
    const {healthworker } = useContext(LoginContext); 
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [cities, setCities] = useState([])
    const [countries, setCountries] = useState([])
    const [data, setData] = useState([]);
    const [dob, setDob] = useState(new Date('1987-08-18T21:11:54'));
    const location = useLocation(); //contains patient details from the patient list
    const [name, setName] = useState({})
    


    var tblcolumns = [
        {title: "id", field: "id", hidden: true},
        {title: "First name", field: "fname"},
        {title: "Last name", field: "lname"},
        {title: "Gender", field: "gender", lookup: {"male": "male", "female": "female", "other": "other"}},
        {title: "Date-of-birth", field: "dob", editComponent: () => {
            return (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        disableFuture="true"
                        format="dd/MM/yyyy"
                        value={dob}
                        onChange={handleDateChange}
                        variant="inline"
                    />
                </MuiPickersUtilsProvider>
            )
        }},
        {title: "Email", field: "email"},
        {title: "Phone", field: "phone", type: 'numeric' },
        {title: "Country", field: "country", editComponent: () => {
            return (
                <Select value={country} onChange={(e) => setCountry(e.target.value)}>
                    {countries.map((item)=> {
                        return <MenuItem key={item._id} value={item.name}>{item.name}</MenuItem>
                    })}
                </Select>
            )
          }
        },
        /*{title: "City", field: "city", editComponent: () => {
            return (
                <Select value={city} onChange={(e) => setCity(e.target.value)}>
                    {cities.map((item, i)=> {
                        return <MenuItem key={i} value={item}>{item}</MenuItem>
                    })}
                </Select>
            )
        }}*/
        {title: "City", field: "city", editComponent: () => {
            return (
                <Autocomplete
                    value={city}
                    onChange={(e, newValue) => setCity(newValue)}
                    id="combo-box-demo"
                    options={cities}
                    style={{ width: 200 }}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params}  />}
                />
            )
        }}
    ]

    //error
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])
    //backdrop
    const [open, setOpen] = useState(false);

    //date picker
    const handleDateChange = (date) => {
        setDob(date);
    };


    useEffect(() => {
        api.get("/countries", api_header())
            .then(res => {                  
                setCountries(res.data)
                setIserror(false)
                setErrorMessages([])
             })
             .catch(error=>{
                 setIserror(true)
                 setErrorMessages(["Could not load countries. Try again later and contact admin if problem persist"])
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

    useEffect(() => {
        setOpen(true)
        api.get("/patients/"+match.params.id, api_header())
            .then(res => {
                const patient = res.data.patient
                setName(patient.name)
                //for material-table
                var tableData = [];
                tableData.push({
                    id: patient._id,
                    fname: patient.name.first_name,
                    lname: patient.name.last_name,
                    gender: patient.gender,
                    dob: patient.DOB,
                    email: patient.contact.email,
                    phone: patient.contact.phone,
                    city: patient.contact.city,
                    country: patient.contact.country
                })
                setTimeout(() => {
                    setData(tableData)
                    setIserror(false)
                    setErrorMessages([])
                    setOpen(false)
                    
                }, 500);

             })
             .catch(error => {

                setIserror(true)
                setErrorMessages(["Could not load patients. Try again later and contact admin if problem persist"])
                setOpen(false)
                
             })
    }, [])


    const handleRowUpdate = (newData, oldData, resolve, reject) => {
        let errMsg = []
        if(newData.fname == ""){
            errMsg.push("Please enter first name")
        }
        if(newData.lname == ""){
            errMsg.push("Please enter last name")
        }
        if(newData.email != "" && validateEmail(newData.email) == false){
            errMsg.push("Please enter a valid email")
        }

        let tempCountry = ""
        let tempCity = ""

        if(country == ""){
            setCountry(oldData.country)
            tempCountry = oldData.country
        }else{
            tempCountry = country
        }
        if(city == ""){
            setCity(oldData.city)
            tempCity = oldData.city
        }else{
            tempCity = city
        }

        if(errMsg.length < 1){
            const data_updated = [
                {"propName": "name.first_name", "value": newData.fname},
                {"propName": "name.last_name", "value": newData.lname},
                {"propName": "gender", "value": newData.gender},
                {"propName": "DOB", "value": dob},
                {"propName": "contact.email", "value": newData.email},
                {"propName": "contact.city", "value": tempCity},
                {"propName": "contact.country", "value": tempCountry},
                {"propName": "contact.phone", "value": newData.phone},
                {"propName": "updated_at", "value": new Date()},
                {"propName": "updated_by", "value": healthworker.id},
            ]

            const patient_id = newData.id
            api.patch("/patients/"+patient_id, data_updated, api_header())
                .then(res => {
                    setName(res.data.updatedPatient.name)
                    const updatedPatient = res.data.updatedPatient;
                    let updatedRowData = {
                        id: updatedPatient._id,
                        fname: updatedPatient.name.first_name,
                        lname: updatedPatient.name.last_name,
                        gender: updatedPatient.gender,
                        dob: updatedPatient.DOB,
                        email: updatedPatient.contact.email,
                        phone: updatedPatient.contact.phone,
                        city: updatedPatient.contact.city,
                        country: updatedPatient.contact.country
                    }
                    //update table
                    const newTableData = [...data];
                    newTableData[data.indexOf(oldData)] = updatedRowData
                    
                    setData(newTableData)
                    setErrorMessages([])
                    setIserror(false)

                    setTimeout(() => {
                        resolve()
                    }, 500);

                    
                })
                .catch(error => {
                    setIserror(true)
                    setErrorMessages(["Update failed. Please try again later. If problem persist contact admin"])
                    reject()
                })
        }else{
            setErrorMessages(errMsg)
            setIserror(true)
            reject()
        }
    }

    //read only form for loggout users or login users who accesses another user's page
    return (
        <div className={classes.root}>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {!open &&
                <h1 style={{padding:10, color: 'rgba(245, 0, 87, 1)'}}>{name.first_name+"'s" + " Biodata"}</h1>
            }
            
            <div>
                {iserror && 
                    <Alert severity="error">
                        {errorMessages.map((msg, i) => {
                            return <div key={i}>{msg}</div>
                        })}
                    </Alert>
                }
                
            </div>
            
            <div>
                <MaterialTable
                    options={{
                        search: false,
                        paging: false
                    }}
                    title=""
                    icons={tableIcons}
                    columns={tblcolumns}
                    data={data}
                    editable={{
                        onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            handleRowUpdate(newData, oldData, resolve, reject)
                        })
                    }}
                    
                />
            </div>

        </div>
    )
}
 
export default Bio;