import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import VisibilityIcon from '@material-ui/icons/Visibility';
import Avatar from 'react-avatar';

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
import Alert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { pink } from '@material-ui/core/colors';
import { LoginContext } from '../../context/LoginContext';
import { PatientContext } from '../../context/PatientContext'

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const h1color = pink["500"]


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

function getFirstname(){
    const storedUser = JSON.parse(window.localStorage.getItem('login'));
    if(storedUser){
        const first_name = storedUser.fname
        return first_name
    }else{
        return null;
    }
}

function getLastname(){
    const storedUser = JSON.parse(window.localStorage.getItem('login'));
    if(storedUser){
        const last_name = storedUser.lname
        return last_name
    }else{
        return null;
    }
}

function validateEmail(email){
    const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
    return re.test(String(email).toLowerCase());
}


function get_id(){
    const storedUser = JSON.parse(window.localStorage.getItem('login'));
    if(storedUser){
        const id = storedUser.id
        return id
    }else{
        return null;
    }
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

function Patients(){

    const classes = useStyles();
    const history = useHistory();
    const { dispatchPatient } = useContext(PatientContext)
    const [patients, setPatients] = useState([])
    const [filteredPatients, setFilteredPatients] = useState([])
    const [fullname, setFullname] = useState('')
    const [id, setId] = useState('')

    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [cities, setCities] = useState([])
    const [countries, setCountries] = useState([])
    const [data, setData] = useState([]);
    const [dob, setDob] = useState(new Date('1987-08-18T21:11:54'));
    const {healthworker } = useContext(LoginContext); 

    
    var tblcolumns = [
        {title: "", render: rowData => <Avatar maxInitials={1} size={40} round={true} name={rowData == undefined ? " " : rowData.fname} />  },
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
        {title: "Phone", field: "phone", type: 'numeric'},
        {title: "Country", field: "country", editComponent: () => {
            return (
                <Select value={country} onChange={(e) =>  setCountry(e.target.value)}>
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
        api.get("/patients", api_header())
            .then(res=>{
                setPatients(res.data.patients)
                setFilteredPatients(res.data.patients)
                setFullname(getFirstname() + " " + getLastname())
                setId(get_id())

                //for material-table
                var tableData = [];
                const returnedData = res.data.patients
                    returnedData.forEach((patient)=> {
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
                    });
                    
                    setTimeout(() => {
                        setData(tableData)
                        setIserror(false)
                        setErrorMessages([])
                        setOpen(false)
                        
                    }, 500);

                    
            })
            .catch(error=>{
                setTimeout(() => {
                    setIserror(true)
                    setErrorMessages(["Could not load patients. Try again later and contact admin if problem persist"])
                    setOpen(false)

                }, 50);
                
            })
    }, [])

    const filterPatients = (e) => {
        const query = e.target.value

        if(query === ""){
            setFilteredPatients(patients)
        }else{
          api.get("/patients/filter/"+query, api_header())
          .then(res=>{
              const returnedData = res.data.patients
              if(returnedData !== undefined){ // no entries found
                  setFilteredPatients(res.data.patients)
              }else{
                  setFilteredPatients([])
              }
              
          })
          .catch(error=>{
              console.log("Cannot fetch data")
          })
        }        
    }

    const handleRowAdd = (newRow, resolve, reject) => {
        let errMsg = []
        if(newRow.fname == undefined){
            errMsg.push("Please enter first name")
        }
        if(newRow.lname == undefined){
            errMsg.push("Please enter last name")
        }
        if(country == ""){
            errMsg.push("Please select country")
        }
        if(city == ""){
            errMsg.push("Please select city")
        }
        if(newRow.gender == undefined){
            errMsg.push("Please select gender")
        }
        if(newRow.email != "" && validateEmail(newRow.email) == false){
            errMsg.push("Please enter a valid email")
        }

        if(errMsg.length < 1){
            const dataToAdd = {
                name : {
                    first_name : newRow.fname,
                    last_name : newRow.lname
                },
                DOB : dob,
                gender : newRow.gender,
                contact : {
                    email : newRow.email,
                    phone : newRow.phone,
                    city : city,
                    country : country
                },
                created_by: healthworker.id,
                created_at: new Date(),
                updated_by: healthworker.id,
                updated_at: new Date()
            };
            
            api.post("/patients", dataToAdd, api_header())
                .then(res => {
                    let addedPatient = res.data.createdPatient

                    let rowToAdd = {
                        id: addedPatient._id,
                        fname: addedPatient.name.first_name,
                        lname: addedPatient.name.last_name,
                        gender: addedPatient.gender,
                        dob: addedPatient.DOB,
                        email: addedPatient.contact.email,
                        phone: addedPatient.contact.phone,
                        city: addedPatient.contact.city,
                        country: addedPatient.contact.country
                    }
                    const newTableData = [...data];
                    newTableData.push(rowToAdd)
                    setData(newTableData)
                    setErrorMessages([])
                    setIserror(false)
                    
                    setTimeout(() => {
                        resolve()
                    }, 500);

                })
                .catch(error=> {
                    if(error.response){
                        if(error.response.data.message === "Email exists"){
                            setErrorMessages(["Email already exist. Please choose another valid email address!"])
                        }else{
                            setErrorMessages(["Error adding patient! Please try again later. If problem persist, contact admin"])
                        }
                    }else{
                        setErrorMessages(["Error adding patient! Please try again later. If problem persist, contact admin"])
                    }
                    setIserror(true)
                    reject()
                })
        }else{
            setErrorMessages(errMsg)
            setIserror(true)
            reject()
        }
    }

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
        
        if(errMsg.length < 1){
            const data_updated = [
                {"propName": "name.first_name", "value": newData.fname},
                {"propName": "name.last_name", "value": newData.lname},
                {"propName": "gender", "value": newData.gender},
                {"propName": "DOB", "value": dob},
                {"propName": "contact.email", "value": newData.email},
                {"propName": "contact.city", "value": city || oldData.city},
                {"propName": "contact.country", "value": country || oldData.country},
                {"propName": "contact.phone", "value": newData.phone},
                {"propName": "updated_at", "value": new Date()},
                {"propName": "updated_by", "value": healthworker.id},
            ]
    
            const patient_id = newData.id
            api.patch("/patients/"+patient_id, data_updated, api_header())
                .then(res => {
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

    const handleRedirect = (id) => {
        api.get("/metrics/number/"+id)
            .then(res => {   
                const count = res.data.count
                dispatchPatient({type: 'GET_NUM_METRICS', count});
            })
            .catch(error=> {
                const count = 0
                dispatchPatient({type: 'GET_NUM_METRICS', count});
            })


        api.get("/patient_symptoms/number/"+id)
            .then(res => {
                const count = res.data.count
                dispatchPatient({type: 'GET_NUM_SYMPTOMS', count})
            })
            .catch(error=> {
                const count = 0
                dispatchPatient({type: 'GET_NUM_SYMPTOMS', count})
            })

        api.get("/patient_diagnostics/number/"+id)
            .then(res => {
                const count = res.data.count
                dispatchPatient({type: 'GET_NUM_DIAGNOSTICS', count})
            })
            .catch(error=> {
                const count = 0
                dispatchPatient({type: 'GET_NUM_DIAGNOSTICS', count})
            })

        history.push("/patients/biodata/" + id)
    }
    //read only form for loggout users or login users who accesses another user's page
    return (
        <div className={classes.root}>
            {!open &&
                <h1 style={{color: h1color}}>Patients</h1>
            }
            
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

            <div>
                <MaterialTable
                    actions={[
                        {
                            icon: () => <VisibilityIcon className={classes.icon_color} />,
                            tooltip: 'Click to view/add more details',
                            onClick: (event, rowData) => {handleRedirect(rowData.id)}
                            //onClick: (event, rowData) => history.push("/patients/biodata/" + rowData.id)
                        }
                        ]}
                        title=""
                        icons={tableIcons}
                        columns={tblcolumns}
                        data={data}
                        editable={{
                            onRowAdd: (newData) =>
                            new Promise((resolve, reject) => {
                                handleRowAdd(newData, resolve, reject);
                            }),
                            onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                handleRowUpdate(newData, oldData, resolve, reject);
                            }),
                        }}
                />
            </div>
        </div>
    )
}
 
export default Patients;