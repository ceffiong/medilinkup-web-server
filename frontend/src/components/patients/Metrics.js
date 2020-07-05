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
import { useHistory } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import { isThisQuarter } from 'date-fns';
import { LoginContext } from '../../context/LoginContext';

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

const convertTo2dp = (num) => {
    let result = (Math.round(num * 100) / 100).toFixed(2);
    return result
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

function Metrics({match}){
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
        {title: "Height (cm)", field: "height", type: 'numeric' },
        {title: "Weight (kg)", field: "weight", type: 'numeric' },
        {title: "BMI", field: "bmi", editable: 'never'},
        {title: "Weight status", field: "weight_status", editable: 'never'},
        {title: "Prenant", field: "pregnant", lookup: {"yes": "yes", "no": "no", "N/A": "N/A"}},
        {title: "Blood group", field: "blood_group", lookup: {"A+": "A+", "A-": "A-", "B+": "B+", "B-": "B-", "AB+": "AB+", "AB-": "AB-", "O+": "O+", "O-": "O-"}},
        {title: "Smoking", field: "smoking", lookup: {"yes": "yes", "no": "no"}},
        {title: "Drinking alcohol", field: "drinking_alcohol", lookup: {"yes": "yes", "no": "no"}},
        {title: "Comorbidity", field: "comorbidity", lookup: {"yes": "yes", "no": "no"}},
        {title: "Comorbidity details", field: "cormorbidity_details"},
        {title: "Testing indication", field: "testing_indication", lookup: {"yes": "yes", "no": "no"}},
        {title: "Created by", field: "created_by", hidden: true},
        {title: "Updated by", field: "updated_by", hidden: true},
        {title: "Created at", field: "created_at", editable: 'never', render: rowData => <Link 
            component="button" variant="body2" onClick={() => history.push("/profile/"+rowData.created_by)}>{rowData == undefined ? " " : rowData.created_at}
        </Link>},
        {title: "Updated at", field: "updated_at", editable: 'never', render: rowData => <Link 
            component="button" variant="body2" onClick={() => history.push("/profile/"+rowData.updated_by)} href="#">{rowData == undefined ? " " : rowData.updated_at}
        </Link>}
    ]


    const [data, setData] = useState([])
    const [patient, setPatient] = useState({})
    
    //error
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    //backdrop
    const [open, setOpen] = useState(false);

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


    useEffect(() => { 
        setOpen(true)
        api.get("/metrics/patients/"+match.params.id, api_header())
            .then(res=>{
                var tableData = [];
                if(res.data.metrics.length > 0){
                    const returnedData = res.data.metrics
                    returnedData.forEach((metric)=> {
                        tableData.push({
                            id: metric._id,
                            height: metric.height,
                            weight: metric.weight,
                            bmi: convertTo2dp(metric.BMI),
                            weight_status: metric.weight_status,
                            pregnant: metric.pregnancy_status,
                            blood_group: metric.blood_group,
                            smoking: metric.smoking_status,
                            drinking_alcohol: metric.current_alcohol_drinking,
                            comorbidity: metric.comorbidity.answer,
                            cormorbidity_details: metric.comorbidity.details,
                            testing_indication: metric.indication_for_testing,
                            created_by: metric.created_by,
                            created_at: metric.created_at,
                            updated_by: metric.updated_by,
                            updated_at: metric.updated_at
                        })
                    });
                    
                    setTimeout(() => {
                        setData(tableData)
                        setOpen(false)
                        setIserror(false)
                        setErrorMessages([])
                    }, 500)
                    
                }else{
                    setOpen(false)
                    setIserror(false)
                    setErrorMessages([])
                }
            })
            .catch(error=>{
                setOpen(false)
                setIserror(true)
                setErrorMessages(["Error fetching patient's anthropometric data. Try again later and contact admin if problem persist"])

            })
    }, [])


    const handleRowAdd = (newRow, resolve, reject) => {

        let w = 0
        let h = 0
        let BMI = 0
        let weight_status = "N/A";
        if(newRow.weight === undefined || newRow.height === undefined){
            w = 0
            h = 0
            BMI = 0.0
        }else{
            w = newRow.weight
            h = (newRow.height)/100
            let bmi_temp = w/(h*h);
            BMI = convertTo2dp(bmi_temp)

            if(BMI < 18.5){
                weight_status = "underweight"
            }else if (BMI >= 18.5 && BMI <= 24.9){
                weight_status = "normal weight"
            }else if(BMI >= 25 && BMI <= 29.9){
                weight_status = "overweight"
            }else if(BMI >= 30){
                weight_status = "obesity"
            }else{
                weight_status = "unknown"
            }
        }

        let errMsg = []
        if(newRow.height === undefined){
           errMsg.push("Please enter height")
        }
        if(newRow.weight === undefined){
            errMsg.push("Please enter weight")
        }
        if(newRow.pregnant === undefined){
            errMsg.push("Please select pregnancy status")
        }
        if(newRow.blood_group === undefined){
            errMsg.push("Please select blood group")
        }
        if(newRow.smoking === undefined){
            errMsg.push("Please select smoking status")
        }
        if(newRow.drinking_alcohol === undefined){
            errMsg.push("Please select alcohol drinking status")
        }
        if(newRow.comorbidity === undefined){
            errMsg.push("Please select comorbidity")
        }
        if(newRow.testing_indication === undefined){
            errMsg.push("Please select if you want to be tested")
        }

        if(errMsg.length < 1){ //no error
            const dataToAdd = {
                patient: {
                    _id: patient.id,
                    name: {first_name: patient.firstname, last_name: patient.lastname}
                },
                height: newRow.height,
                weight: newRow.weight,
                BMI: BMI,
                weight_status: weight_status,
                pregnancy_status: newRow.pregnant,
                blood_group: newRow.blood_group,
                smoking_status: newRow.smoking,
                current_alcohol_drinking: newRow.drinking_alcohol,
                comorbidity: {answer: newRow.comorbidity, details: newRow.cormorbidity_details},
                indication_for_testing: newRow.testing_indication,
                created_by: healthworker.id,
                created_at: new Date(),
                updated_by: healthworker.id,
                updated_at: new Date()
            };

            
            api.post("/metrics", dataToAdd, api_header())
                .then(res => {

                    const metric = res.data.createdAnthropometric
                    const rowToAdd = {
                        id: metric._id,
                        height: metric.height,
                        weight: metric.weight,
                        bmi: metric.BMI,
                        weight_status: metric.weight_status,
                        pregnant: metric.pregnancy_status,
                        blood_group: metric.blood_group,
                        smoking: metric.smoking_status,
                        drinking_alcohol: metric.current_alcohol_drinking,
                        comorbidity: metric.comorbidity.answer,
                        cormorbidity_details: metric.comorbidity.details,
                        testing_indication: metric.indication_for_testing,
                        created_by: metric.created_by,
                        created_at: metric.created_at,
                        updated_by: metric.updated_by,
                        updated_at: metric.updated_at
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
                    setErrorMessages(["Error adding patient anthropometrics Please try again later. If problem persist, contact admin"])
                    reject()
                })
        }else{
            setErrorMessages(errMsg)
            setIserror(true)
            reject()
        }
    } 

    const handleRowUpdate = (newData, oldData, resolve, reject) => {

        let w = 0
        let h = 0
        let BMI = 0
        let weight_status = "N/A";
        if(newData.weight === undefined || newData.height === undefined){
            w = 0
            h = 0
            BMI = 0.0
        }else{
            w = newData.weight
            h = (newData.height)/100
            BMI = w/(h*h);

            if(BMI < 18.5){
                weight_status = "underweight"
            }else if (BMI >= 18.5 && BMI <= 24.9){
                weight_status = "normal weight"
            }else if(BMI >= 25 && BMI <= 29.9){
                weight_status = "overweight"
            }else if(BMI >= 30){
                weight_status = "obesity"
            }else{
                weight_status = "unknown"
            }
        }

        const metric_id = newData.id 

        let errMsg = []
        if(newData.height === ""){
           errMsg.push("Please enter height")
        }
        if(newData.weight === ""){
            errMsg.push("Please enter weight")
        }
        if(newData.pregnant === ""){
            errMsg.push("Please select pregnancy status")
        }
        if(newData.blood_group === ""){
            errMsg.push("Please select blood group")
        }
        if(newData.smoking === ""){
            errMsg.push("Please select smoking status")
        }
        if(newData.drinking_alcohol === ""){
            errMsg.push("Please select alcohol drinking status")
        }
        if(newData.comorbidity === ""){
            errMsg.push("Please select comorbidity")
        }
        if(newData.testing_indication === ""){
            errMsg.push("Please select if you want to be tested")
        }

        if(errMsg.length < 1){ //no error

            const data_updated = [
                {"propName": "height", "value": newData.height},
                {"propName": "weight", "value": newData.weight},
                {"propName": "BMI", "value": BMI},
                {"propName": "weight_status", "value": weight_status},
                {"propName": "pregnancy_status", "value": newData.pregnant},
                {"propName": "blood_group", "value": newData.blood_group},
                {"propName": "smoking_status", "value": newData.smoking},
                {"propName": "current_alcohol_drinking", "value": newData.drinking_alcohol},
                {"propName": "comorbidity.answer", "value": newData.comorbidity},
                {"propName": "comorbidity.details", "value": newData.cormorbidity_details},
                {"propName": "indication_for_testing", "value": newData.testing_indication},
                {"propName": "updated_by", "value": healthworker.id},
                {"propName": "updated_at", "value": new Date()},
            ]
            
            api.patch("/metrics/"+metric_id, data_updated, api_header())
                .then(res => {
                    const metric = res.data.updatedMetric
                    const updatedRowData = {
                        id: metric._id,
                        height: metric.height,
                        weight: metric.weight,
                        bmi: convertTo2dp(metric.BMI),
                        weight_status: metric.weight_status,
                        pregnant: metric.pregnancy_status,
                        blood_group: metric.blood_group,
                        smoking: metric.smoking_status,
                        drinking_alcohol: metric.current_alcohol_drinking,
                        comorbidity: metric.comorbidity.answer,
                        cormorbidity_details: metric.comorbidity.details,
                        testing_indication: metric.indication_for_testing,
                        created_by: metric.created_by,
                        created_at: metric.created_at,
                        updated_by: metric.updated_by,
                        updated_at: metric.updated_at
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
                    setErrorMessages(["Error updating patient anthropometrics Please try again later. If problem persist, contact admin"])
                    reject()
                })
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
            
            {!open && <h1 style={{padding:10, color: 'rgba(245, 0, 87, 1)'}}>{null || patient.firstname}, Anthropometric</h1>}
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
                        onRowAdd: (newData) =>
                        new Promise((resolve, reject) => {
                            handleRowAdd(newData, resolve, reject);
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

export default Metrics;