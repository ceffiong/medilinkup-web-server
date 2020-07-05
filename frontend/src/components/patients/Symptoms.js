import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactDOM from "react-dom";
import MaterialTable from "material-table";
import { makeStyles } from '@material-ui/core/styles';
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
import {Grid} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { useHistory } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import { LoginContext } from '../../context/LoginContext';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

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
        margin: theme.spacing(5)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
  }));

function Symptoms({match}){
    const classes = useStyles();
    const history = useHistory();
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

    const columns = [
        {title: "id", field: "id", hidden: true},
        /*{title: "Symptoms", field: "symptom", editComponent: () => {
            return (
                <Select value={symptom} onChange={(e) => setSymptom(e.target.value)}>
                    {symptoms.map((item, i)=> {
                        return <MenuItem key={i} value={item}>{item}</MenuItem>
                    })}
                </Select>
            )
          }
        },*/
        {title: "Symptoms", field: "symptom", editComponent: () => {
            return (
                <Autocomplete
                    value={symptom}
                    onChange={(e, newValue) => setSymptom(newValue)}
                    id="combo-box-symptoms"
                    options={symptoms}
                    style={{ width: 200 }}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params}  />}
                />
            )
        }},
        {title: "Outcome", field: "outcome"},
        {title: "Onset", field: "onset", editComponent: () => {
            return (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        disableFuture="true"
                        format="dd/MM/yyyy"
                        value={onset}
                        onChange={handleDateChange}
                        variant="inline"
                    />
                </MuiPickersUtilsProvider>
            )
        }},
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
                    id="combo-box-city"
                    options={cities}
                    style={{ width: 200 }}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params}  />}
                />
            )
        }},
        {title: "Duration (days)", field: "duration", type: 'numeric' },
        {title: "Severity", field: "severity", lookup: {"low": "low", "medium": "medium", "high": "high"}},
        {title: "Admission date", field: "admission", editComponent: () => {
            return (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        disableFuture="true"
                        format="dd/MM/yyyy"
                        value={admission}
                        onChange={handleAdmissionDateChange}
                        variant="inline"
                    />
                </MuiPickersUtilsProvider>
            )
        }},
        {title: "Discharged/death date", field: "discharged", editComponent: () => {
            return (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        disableFuture="true"
                        format="dd/MM/yyyy"
                        value={discharged}
                        onChange={handleDischargedDateChange}
                        variant="inline"
                    />
                </MuiPickersUtilsProvider>
            )
        }},
        {title: "Comment", field: "comment"},
        {title: "Created by", field: "created_by", hidden: true},
        {title: "Updated by", field: "updated_by", hidden: true},
        {title: "Created at", field: "created_at", editable: 'never', render: rowData => <Link 
            component="button" variant="body2" onClick={() => history.push("/profile/"+rowData.created_by)}>{rowData == undefined ? " " : rowData.created_at}
        </Link>},
        {title: "Updated at", field: "updated_at", editable: 'never', render: rowData => <Link 
            component="button" variant="body2" onClick={() => history.push("/profile/"+rowData.updated_by)} href="#">{rowData == undefined ? " " : rowData.updated_at}
        </Link>}
    ]

    //error
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])
    const [data, setData] = useState([])

    //list
    const [symptoms, setSymptoms] = useState([])
    const [symptomClasses, setSymptomClasses] = useState([])
    const [cities, setCities] = useState([])
    const [countries, setCountries] = useState([])

    //non-list data
    const [symptom, setSymptom] = useState('')
    const [symptomClass, setSymptomClass] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [admission, setAdmission] = useState(new Date('1987-08-18T21:11:54'));
    const [discharged, setDischarged] = useState(new Date('1987-08-18T21:11:54'));
    const [onset, setOnset] = useState(new Date('1987-08-18T21:11:54'));

    const {healthworker } = useContext(LoginContext); 
    const [patient, setPatient] = useState({})

    //backdrop
    const [open, setOpen] = useState(false);
    const [loadCountry, setLoadCountry] = useState(false)
    const [loadCity, setLoadCity] = useState(false)

    //date picker
    const handleDateChange = (date) => {
        setOnset(date);
    };

    const handleAdmissionDateChange = (date) => {
        setAdmission(date);
    };

    const handleDischargedDateChange = (date) => {
        setDischarged(date)
    }

    useEffect(() => { 
        api.get("/patients/"+match.params.id, api_header())
        .then(res => {
            let fname = res.data.patient.name.first_name
            let lname = res.data.patient.name.last_name
            setPatient({id: match.params.id, firstname: fname, lastname: lname})
        })
        .catch(error=>{
            setIserror(true)
            setErrorMessages(["Cannot get patient details. Please try again later. Contact admin if problem persist!"])
        })
        
    }, [])

    //get all country
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

    //get cities from country
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

    // Get symptoms and symptom class
    useEffect(() => {
        setOpen(true)
        api.get("/symptoms", api_header())
        .then(res=>{
            setSymptoms(res.data[0].symptoms)
            setTimeout(() => {
                setIserror(false)
                setErrorMessages([])
                setOpen(false)
            }, 250);

        })
        .catch(error=>{
            
            setIserror(true)
            setErrorMessages(["Error fetching list of symptoms. Try again later and contact admin if problem persist"])
        })

        api.get("/symptom_class", api_header())
        .then(res=>{
            setSymptomClasses(res.data[0].classes)

            setTimeout(() => {
                setIserror(false)
                setErrorMessages([])
                setOpen(false)
            }, 250);
        })
        .catch(error=>{

            if(error.response.data.message === "Auth failed"){
                history.push("/healthworker/logout")
                setOpen(false)
            }else{
                setOpen(false)
                setIserror(true)
                setErrorMessages(["Error fetching list of symptoms class. Try again later and contact admin if problem persist"])
            }
        })
    }, [])


    // Get symptoms data for this patient
    useEffect(() => {
        setOpen(true)
        api.get("/patient_symptoms/patients/"+match.params.id, api_header())
            .then(res=>{
                var tableData = [];
                if(res.data.patient_symptoms){
                    if(res.data.patient_symptoms.length > 0){
                        const returnedData = res.data.patient_symptoms
                        returnedData.forEach((symp)=> {
                            tableData.push({
                                id: symp._id,
                                symptom: symp.symptom,
                                symptom_class: symp.symptom_class,
                                outcome: symp.outcome,
                                onset: symp.onset,
                                country: symp.location.country,
                                city: symp.location.city,
                                duration: symp.duration,
                                severity: symp.severity,
                                admission: symp.admission_date,
                                discharged: symp.discharged_death_date,
                                comment: symp.comment,
                                created_by: symp.created_by,
                                created_at: symp.created_at,
                                updated_by: symp.updated_by,
                                updated_at: symp.updated_at
                            })
                        });
                        setTimeout(() => {
                            setData(tableData)
                            setOpen(false)
                        }, 500)
                        
                    }
                }else{
                    setTimeout(() => {
                        setData(tableData)
                        setOpen(false)
                    }, 500)
                }
                
            })
            .catch(error=>{

                if(error.response.data.message === "Auth failed"){
                    history.push("/healthworker/logout")
                    setOpen(false)
                }else{
                    setIserror(true)
                    setErrorMessages(["Error fetching patient symptom data. Try again later and contact admin if problem persist"])
                    setOpen(false)
                }
            })
    }, [])

    const handleRowAdd = (newRow, resolve, reject) => {
        let errMsg = []
        if(symptom === ""){
            errMsg.push("Please select symptom")
        }
        if(symptomClass === ""){
            errMsg.push("Please select symptom class")
        }
        if(country == ""){
            errMsg.push("Please select country")
        }
        if(city == ""){
            errMsg.push("Please select city")
        }
        if(newRow.outcome === undefined){
            errMsg.push("Please enter outcome")
        }
        if(onset === ""){
            errMsg.push("Please select onset date")
        }
        if(newRow.duration === undefined){
            errMsg.push("Please enter duration (days)")
        }
        if(newRow.severity === undefined){
            errMsg.push("Please select severity")
        }
        if(admission === ""){
            errMsg.push("Select hospital admission date")
        }
        if(discharged === ""){
            errMsg.push("Select discharged or death date")
        }

        if(errMsg.length < 1){
            if(errMsg.length < 1){
                const dataToAdd = {
                    patient : {
                        _id: patient.id,
                        name: {
                            first_name : patient.firstname,
                            last_name : patient.lastname
                        }
                    },
                    symptom : symptom,
                    symptom_class : symptomClass,
                    outcome: newRow.outcome,
                    onset : onset,
                    location : {
                        country : country,
                        city : city
                    },
                    duration : newRow.duration,
                    severity : newRow.severity,
                    admission_date : admission,
                    discharged_death_date : discharged,
                    comment: newRow.comment,
                    created_by: healthworker.id,
                    created_at: new Date(),
                    updated_by: healthworker.id,
                    updated_at: new Date()
                };
                
                api.post("/patient_symptoms", dataToAdd, api_header())
                    .then(res => {
                        const symp = res.data.createdSymptoms
                        const rowToAdd = {
                            id: symp._id,
                            symptom: symp.symptom,
                            symptom_class: symp.symptom_class,
                            outcome: symp.outcome,
                            onset: symp.onset,
                            country: symp.location.country,
                            city: symp.location.city,
                            duration: symp.duration,
                            severity: symp.severity,
                            admission: symp.admission_date,
                            discharged: symp.discharged_death_date,
                            comment: symp.comment,
                            created_by: symp.created_by,
                            created_at: symp.created_at,
                            updated_by: symp.updated_by,
                            updated_at: symp.updated_at
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
                        setIserror(true)
                        setErrorMessages(["Error adding patient symptoms! Please try again later. If problem persist, contact admin"])
                        reject()
                    })
            }else{
                setErrorMessages(errMsg)
                setIserror(true)
                reject()
            }
        }else{
            setErrorMessages(errMsg)
            setIserror(true)
            reject()
        }
    }


    const handleRowUpdate = (newData, oldData, resolve, reject) => {
        let errMsg = []
        if(newData.outcome === ""){
            errMsg.push("Please enter outcome")
        }
        if(newData.duration === ""){
            errMsg.push("Please enter duration (days)")
        }
        if(newData.severity === ""){
            errMsg.push("Please select severity")
        }

        const symptom_id = newData.id 
       
        if(errMsg.length < 1){
            if(errMsg.length < 1){
                const data_updated = [
                    {"propName": "symptom", "value": symptom || oldData.symptom},
                    {"propName": "symptom_class", "value": symptomClass || oldData.symptom_class},
                    {"propName": "outcome", "value": newData.outcome},
                    {"propName": "onset", "value": onset || oldData.onset},
                    {"propName": "location.country", "value": country || oldData.country},
                    {"propName": "location.city", "value": city || oldData.city},
                    {"propName": "duration", "value": newData.duration},
                    {"propName": "severity", "value": newData.severity},
                    {"propName": "admission_date", "value": admission || oldData.admission},
                    {"propName": "discharged_death_date", "value": discharged || oldData.disableFuture},
                    {"propName": "comment", "value": newData.comment},
                    {"propName": "updated_by", "value": healthworker.id},
                    {"propName": "updated_at", "value": new Date()},
                ]
                api.patch("/patient_symptoms/"+symptom_id, data_updated, api_header())
                    .then(res => {
                        const symp = res.data.updatedSymptoms
                        const updatedRowData = {
                            id: symp._id,
                            symptom: symp.symptom,
                            symptom_class: symp.symptom_class,
                            outcome: symp.outcome,
                            onset: symp.onset,
                            country: symp.location.country,
                            city: symp.location.city,
                            duration: symp.duration,
                            severity: symp.severity,
                            admission: symp.admission_date,
                            discharged: symp.discharged_death_date,
                            comment: symp.comment,
                            created_by: symp.created_by,
                            created_at: symp.created_at,
                            updated_by: symp.updated_by,
                            updated_at: symp.updated_at
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
                    .catch(error=> {
                        setIserror(true)
                        setErrorMessages(["Error updating patient symptoms! Please try again later. If problem persist, contact admin"])
                        reject()
                    })
            }else{
                setErrorMessages(errMsg)
                setIserror(true)
                reject()
            }
        }else{
            setErrorMessages(errMsg)
            setIserror(true)
            reject()
        }
    }


    return (
        <div className={classes.root}>  
        <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
        {!open &&
            <h1 style={{padding:10, color: 'rgba(245, 0, 87, 1)'}}>{null || patient.firstname}, Symptoms</h1> 
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

        <div style={{ maxWidth: "100%" }}>
                <MaterialTable
                    title=""
                    icons={tableIcons}
                    columns={columns}
                    data={data}
                    editable={{
                        onRowAdd: (newRow) =>
                        new Promise((resolve, reject) => {
                            handleRowAdd(newRow, resolve, reject);
                        }),
                        onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            handleRowUpdate(newData, oldData, resolve, reject);
                        }),
                        onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                            resolve();
                            
                            }, 600);
                        }),
                    }}

                    />
            </div>                    
        </div>
    );

}

export default Symptoms;