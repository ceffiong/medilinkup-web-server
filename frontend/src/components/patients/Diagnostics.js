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

function Diagnostics({match}){
    const classes = useStyles();
    const history = useHistory();
    const {healthworker } = useContext(LoginContext); 
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
        /*{title: "Diagnostic", field: "diagnostic", editComponent: () => {
            return (
                <Select value={diagnostic} onChange={(e) => setDiagnostic(e.target.value)}>
                    {diagnostics.map((item, i)=> {
                        return <MenuItem key={i} value={item}>{item}</MenuItem>
                    })}
                </Select>
            )
          }
        },*/

        {title: "Diagnostic", field: "diagnostic", editComponent: () => {
            return (
                <Autocomplete
                    value={diagnostic}
                    onChange={(e, newValue) => setDiagnostic(newValue)}
                    id="combo-box-diagnostics"
                    options={diagnostics}
                    style={{ width: 200 }}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params}  />}
                />
            )
        }},

        {title: "Outcome", field: "outcome"},
        {title: "Diagnostic date", field: "diagnostic_date", editComponent: () => {
            return (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        disableFuture="true"
                        format="dd/MM/yyyy"
                        value={diagnosticDate}
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
                    id="combo-box-diag-city"
                    options={cities}
                    style={{ width: 200 }}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params}  />}
                />
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
    const [diagnostics, setDiagnostics] = useState([])
    const [cities, setCities] = useState([])
    const [countries, setCountries] = useState([])

    //non-list data
    const [diagnostic, setDiagnostic] = useState('')
    const [diagnosticDate, setDiagnosticDate] = useState(new Date('1987-08-18T21:11:54'));
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')

    const [patient, setPatient] = useState({})

    //backdrop
    const [open, setOpen] = useState(false);
    
    //date picker
    const handleDateChange = (date) => {
        setDiagnosticDate(date);
    }

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

    // Get diagnostics
    useEffect(() => {
        setOpen(true)
        api.get("/diagnostics", api_header())
        .then(res=>{
            setDiagnostics(res.data[0].diagnostics)
            
            setTimeout(() => {
                setOpen(false)
                setIserror(false)
                setErrorMessages([])
            }, 500);

            
        })
        .catch(error=>{
            setIserror(true)
            setErrorMessages(["Error fetching diagnostics list. Try again later and contact admin if problem persist"])
            setOpen(false)
            
        })
    }, [])


    // Get diagnostic data for this patient
    useEffect(() => {
        setOpen(true)
        api.get("/patient_diagnostics/patients/"+match.params.id, api_header())
        .then(res=>{
            var tableData = [];
            if(res.data.patient_diagnostics){
                if(res.data.patient_diagnostics.length > 0){
                    const returnedData = res.data.patient_diagnostics
                    
                    returnedData.forEach((diag)=> {
                        tableData.push({
                            id: diag._id,
                            diagnostic: diag.diagnostic,
                            diagnostic_date: diag.diagnostic_date,
                            outcome: diag.outcome,
                            country: diag.location.country,
                            city: diag.location.city,
                            comment: diag.comment,
                            created_by: diag.created_by,
                            created_at: diag.created_at,
                            updated_by: diag.updated_by,
                            updated_at: diag.updated_at
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
                }, 50)
            }
            
        })
        .catch(error=>{
            setIserror(true)
            setErrorMessages(["Error fetching diagnostics. Try again later and contact admin if problem persist"])
            setOpen(false)
            
        })
    }, [])

    const handleRowAdd = (newRow, resolve, reject) => {
        let errMsg = []
        if(diagnostic === ""){
            errMsg.push("Please select diagnostic")
        }
        if(country === ""){
            errMsg.push("Please select country")
        }
        if(city === ""){
            errMsg.push("Please select city")
        }
        if(newRow.outcome === undefined){
            errMsg.push("Please enter outcome")
        }
        if(diagnosticDate === ""){
            errMsg.push("Select diagnostic date date")
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
                    diagnostic : diagnostic,
                    outcome: newRow.outcome,
                    diagnostic_date : diagnosticDate,
                    location : {
                        country : country,
                        city : city
                    },
                    comment: newRow.comment,
                    created_by: healthworker.id,
                    created_at: new Date(),
                    updated_by: healthworker.id,
                    updated_at: new Date()
                };
                
                api.post("/patient_diagnostics", dataToAdd, api_header())
                    .then(res => {
                        console.log("ldjflasjfla")
                        console.log(res.data)

                        const diag = res.data.createdDiagnostic;

                        const rowToAdd = {
                            id: diag._id,
                            diagnostic: diag.diagnostic,
                            diagnostic_date: diag.diagnostic_date,
                            outcome: diag.outcome,
                            country: diag.location.country,
                            city: diag.location.city,
                            comment: diag.comment,
                            created_by: diag.created_by,
                            created_at: diag.created_at,
                            updated_by: diag.updated_by,
                            updated_at: diag.updated_at
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
                        setErrorMessages(["Error adding patient diagnostic! Please try again later. If problem persist, contact admin"])
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
        
        const diagnostic_id = newData.id 

        if(errMsg.length < 1){

            if(errMsg.length < 1){
                const data_updated = [
                    {"propName": "diagnostic", "value": diagnostic || oldData.diagnostic},
                    {"propName": "outcome", "value": newData.outcome},
                    {"propName": "diagnostic_date", "value": diagnosticDate || oldData.diagnostic_date},
                    {"propName": "location.country", "value": country || oldData.country},
                    {"propName": "location.city", "value": city || oldData.city},
                    {"propName": "comment", "value": newData.comment},
                    {"propName": "updated_by", "value": healthworker.id},
                    {"propName": "updated_at", "value": new Date()},
                ]
                api.patch("/patient_diagnostics/"+diagnostic_id, data_updated, api_header())
                    .then(res => {
                        const diag = res.data.updatedDiagnostics;
                        const updatedRowData = {
                            id: diag._id,
                            diagnostic: diag.diagnostic,
                            diagnostic_date: diag.diagnostic_date,
                            outcome: diag.outcome,
                            country: diag.location.country,
                            city: diag.location.city,
                            comment: diag.comment,
                            created_by: diag.created_by,
                            created_at: diag.created_at,
                            updated_by: diag.updated_by,
                            updated_at: diag.updated_at
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
                        setErrorMessages(["Error updating patient diagnostic! Please try again later. If problem persist, contact admin"])
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
                <h1 style={{padding:10, color: 'rgba(245, 0, 87, 1)'}}>{null || patient.firstname}, Diagnostics</h1> 
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

export default Diagnostics;