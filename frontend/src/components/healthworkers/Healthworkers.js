import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination} from '@material-ui/core';
import {Paper, Grid} from '@material-ui/core';
import Avatar from 'react-avatar';
import Box from '@material-ui/core/Box';

import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';


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

const columns = ["Name", "Gender", "Email", "Phone", "City", "Country"]
  

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(5)
    },
    container: {
        maxHeight: 440,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        width: 200
    },
    iconButton: {
        padding: 10,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
  }));

function Healthworkers(){

    const classes = useStyles();
    const history = useHistory();
    const [healthworkers, setHealthworkers] = useState([])
    const [workers, setWorkers] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])
    const [id, setId] = useState('')

    //backdrop
    const [open, setOpen] = useState(false);
    
    useEffect(() => { 
        setOpen(true)
        
        api.get("/healthworkers", api_header())
            .then(res=>{
                
                setTimeout(() => {
                    setHealthworkers(res.data.healthworkers)
                    setWorkers(res.data.healthworkers)
                    setOpen(false)
                }, 500)
            })
            .catch(error=>{
                
                setTimeout(() => {
                    setIserror(true)
                    setErrorMessages("Cannot retrieve list of health officials. Try again later and contact admin if problem persist!")
                    setOpen(false)
                }, 50)
            })
    }, [])

    //table
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    };

    
    const filterHealthworkers = (e) => {
          const query = e.target.value

          if(query === ""){
              setWorkers(healthworkers)
          }else{
            api.get("/healthworkers/filter/"+query, api_header())
            .then(res=>{
                const returnedData = res.data.healthworkers
                if(returnedData !== undefined){ // no entries found
                    setWorkers(res.data.healthworkers)
                }else{
                    setWorkers([])
                }
                
            })
            .catch(error=>{
                console.log("Cannot fetch data")
            })
          }
          
    }

    

    //read only form for loggout users or login users who accesses another user's page
    return (
        <div className={classes.root}>
            {!open &&
                <h1 style={{padding:10, color: 'rgba(245, 0, 87, 1)'}}>Health officials</h1>
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

            <Backdrop className={classes.backdrop} open={open}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                
                <Grid container alignItems="flex-start" justify="flex-end" direction="row">
                    <div component="form" className={classes.searchDiv}>
                        <IconButton className={classes.iconButton} aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <InputBase
                            className={classes.input}
                            placeholder="Search Doctors"
                            inputProps={{ 'aria-label': 'search doctors' }}
                            onChange={filterHealthworkers}
                        />
                        <IconButton type="submit" className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                        <Divider className={classes.divider} orientation="vertical" />
                    </div>
                </Grid>
                
                <Paper>
                <TableContainer className={classes.container}>

                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columns.map((column, i) => (
                            (i == 0
                                ? <TableCell key={i} align="left" style={{ minWidth: 200 }}><Box fontWeight="fontWeightBold" m={1}>{column}</Box></TableCell>
                                : <TableCell key={i} align="left" style={{ minWidth: 170 }}><Box fontWeight="fontWeightBold" m={1}>{column}</Box></TableCell>
                                )
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((worker) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={worker._id}>
                                <TableCell style={{ minWidth: 200 }} align="left"><Avatar maxInitials={1} size={40} round={true} name={worker.name.first_name} />{"   " + worker.name.first_name + " " + worker.name.last_name}</TableCell>
                                <TableCell align="left">{worker.gender}</TableCell>
                                <TableCell align="left">{worker.contact.email}</TableCell>
                                <TableCell align="left">{worker.contact.phone}</TableCell>
                                <TableCell align="left">{worker.contact.city}</TableCell>
                                <TableCell align="left">{worker.contact.country}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[2, 10, 20]}
                    component="div"
                    count={workers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                </Paper>
        </div>
    )
}
 
export default Healthworkers;
