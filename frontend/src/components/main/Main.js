import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Collapse from '@material-ui/core/Collapse';
import Avatar from 'react-avatar';
import Alert from '@material-ui/lab/Alert';
import Badge from '@material-ui/core/Badge';
import TimelineIcon from '@material-ui/icons/Timeline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import GroupIcon from '@material-ui/icons/Group';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import ViewListIcon from '@material-ui/icons/ViewList';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Button from '@material-ui/core/Button';
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react'
import { indigo, pink } from '@material-ui/core/colors';


import { Switch, Route } from 'react-router-dom';
import Login from '../auth/Login';
import Signup from '../auth/Signup'
import Dashboard from '../healthworkers/Dashboard'
import Profile from '../healthworkers/Profile'
import HealthWorkers from '../healthworkers/Healthworkers'
import Patients from '../patients/Patients'
import Bio from '../patients/Bio'
import Metrics from '../patients/Metrics'
import Symptoms from '../patients/Symptoms'
import Diagnostics from '../patients/Diagnostics'
import { LoginContext } from '../../context/LoginContext';
import { MenuContext } from '../../context/MenuContext';
import { PatientContext } from '../../context/PatientContext'
import SignedOut from '../auth/SignedOut'
import axios from 'axios'



const api = axios.create({
  baseURL: process.env.REACT_APP_MY_HOST
})

const drawerWidth = 240;
const mybgcolor = indigo["500"];
const mybgcolorAppbar = indigo["400"];
const dashboardListItem = pink["500"]
const hoverBgColor = pink["50"]

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: mybgcolorAppbar
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    height:"100vh", 
    backgroundColor: mybgcolor,
    padding: theme.spacing(1)

  },
  listItems: {
    margin: 10,
    color: 'white',
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 10
    }
  },

  listItemDone: {
    margin: 10,
    color: 'white',
    borderRadius: 10,
    "&,&:focus": {
      backgroundColor: dashboardListItem,
      
    },
  },
  icon_color: {
    color: 'white',
    fontSize: 30
  },
  // necessary for content to be below app bar
  nested: {
    marginLeft: theme.spacing(3),
    color: 'white',
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    color: 'white',
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 10
    }
  },
  nestedDone: {
    marginLeft: theme.spacing(3),
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    color: 'white',
    borderRadius: 10,
    "&,&:focus": {
      backgroundColor: dashboardListItem
    },
  },
  logo: {
    color: "white",
    alignItems: "center"
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function Main() {

  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [openNested, setOpenNested] = React.useState(false); //nested list
  const [open, setOpen] = React.useState(false); //for drawer
  const {dispatch } = useContext(LoginContext); //for login out

  const [patientMenu, setShowPatientMenu] = useState(false)
  const [patientId, setPatientId] = useState('')
  const [logout, setLogout] = useState(true)

  //error
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])
  const [countPatient, setCountPatient] = useState(0)
  const [countDoctors, setCountDoctors] = useState(0)
  const [healthworker, setHealthworker] = useState({})
  const [countMetrics, setCountMetrics] = useState(0)
  const [countSymptoms, setCountSymptoms] = useState(0)
  const [countDiagnostics, setCountDiagnostics] = useState(0)

  //menu states
  const [profileClicked, setProfileClicked] = useState(false)
  const [dashClicked, setDashClicked] = useState(true)
  const [doctorClicked, setDoctorClicked] = useState(false)
  const [patientClicked, setPatientClicked] = useState(false)
  const [bioClicked, setBioClicked] = useState(false)
  const [metricClicked, setMetricClicked] = useState(false)
  const [symClicked, setSymClicked] = useState(false)
  const [diaClicked, setDiaClicked] = useState(false)

  //get num of health worker
  const { state, dispatched } = useContext(MenuContext)
  const { patientData, dispatchPatient } = useContext(PatientContext)

  const mySwitch = (data) => {
    switch (data) {
      case "click_dashboard":
        setProfileClicked(false)
        setDashClicked(true)
        setDoctorClicked(false)
        setPatientClicked(false)
        setBioClicked(false)
        setMetricClicked(false)
        setSymClicked(false)
        setDiaClicked(false)
        break
      case "click_profile":
        setProfileClicked(true)
        setDashClicked(false)
        setDoctorClicked(false)
        setPatientClicked(false)
        setBioClicked(false)
        setMetricClicked(false)
        setSymClicked(false)
        setDiaClicked(false)
        break;
      case "click_doctors":
        setProfileClicked(false)
        setDashClicked(false)
        setDoctorClicked(true)
        setPatientClicked(false)
        setBioClicked(false)
        setMetricClicked(false)
        setSymClicked(false)
        setDiaClicked(false)
        break
      case "click_patients":
        setProfileClicked(false)
        setDashClicked(false)
        setDoctorClicked(false)
        setPatientClicked(true)
        setBioClicked(false)
        setMetricClicked(false)
        setSymClicked(false)
        setDiaClicked(false)
        break;
      case "click_bio":
        setProfileClicked(false)
        setDashClicked(false)
        setDoctorClicked(false)
        setPatientClicked(false)
        setBioClicked(true)
        setMetricClicked(false)
        setSymClicked(false)
        setDiaClicked(false)
        break;
      case "click_metrics":
        setProfileClicked(false)
        setDashClicked(false)
        setDoctorClicked(false)
        setPatientClicked(false)
        setBioClicked(false)
        setMetricClicked(true)
        setSymClicked(false)
        setDiaClicked(false)
        break;
      case "click_symptoms":
        setProfileClicked(false)
        setDashClicked(false)
        setDoctorClicked(false)
        setPatientClicked(false)
        setBioClicked(false)
        setMetricClicked(false)
        setSymClicked(true)
        setDiaClicked(false)
        break;
      case "click_diagnostics":
        setProfileClicked(false)
        setDashClicked(false)
        setDoctorClicked(false)
        setPatientClicked(false)
        setBioClicked(false)
        setMetricClicked(false)
        setSymClicked(false)
        setDiaClicked(true)
        break;
      default:
        setProfileClicked(false)
        setDashClicked(true)
        setDoctorClicked(false)
        setPatientClicked(false)
        setBioClicked(false)
        setMetricClicked(false)
        setSymClicked(false)
        setDiaClicked(false)
        break;
    }
    
  }

  const handleProfileClick = () => {
    mySwitch("click_profile")
    history.push("/profile/"+healthworker._id)
  }

  const handleDashboardClick = () => {
    mySwitch("click_dashboard")
    history.push("/dashboard/"+healthworker._id) 
  }

  const handleDoctorClick = () => {
    mySwitch("click_doctors")
    history.push("/healthworkers") 
  }

  const handlePatientsClick = () => {
    mySwitch("click_patients")
    history.push("/patients")
  }

  const handleBioClick = () => {
    mySwitch("click_bio")
    history.push("/patients/biodata/"+ patientId)
  }

  const handleMetricClick = () => {
    mySwitch("click_metrics")
    history.push("/patients/anthropometrics/"+ patientId)
  }

  const handleSymClick = () => {
    mySwitch("click_symptoms")
    history.push("/patients/symptoms/"+ patientId)
  }

  const handleDiaClick = () => {
    history.push("/patients/diagnostics/"+ patientId)
    mySwitch("click_diagnostics")
  }


  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //for nested list
  const handleClick = () => {
    setOpenNested(!openNested);
  };

  //logout
  const handleLogout = () => {
    dispatch({type: 'LOGOUT'});
    setLogout(true)
    history.push("/login")
  };

  //get patient data (metrics, symptoms, diagnostics) counts
  useEffect(() => {
    setCountMetrics(patientData.num_metrics)
    setCountDiagnostics(patientData.num_diagnostics)
    setCountSymptoms(patientData.num_symptoms)
  }, [patientData])

  useEffect(() => {
    const { pathname } = location;
    api.get("/healthworkers/number")
        .then(res => {
          setCountDoctors(res.data.count)
        })
        .catch(error=> {
            setCountDoctors(0)
        })
      
    api.get("/patients/number")
      .then(res => {
        setCountPatient(res.data.count)
      })
      .catch(error=> {
        setCountPatient(0)
      })
  }, [location.pathname])

  useEffect(() => {
    const { pathname } = location;
    const storedUser = JSON.parse(window.localStorage.getItem('login'));
    let userToken = {}
    if(storedUser){
      setHealthworker({
        _id: storedUser.id,
        firstname: storedUser.fname,
        lastname: storedUser.lname
      })
      userToken = {
        headers: {
          Authorization: "Bearer " + storedUser.token
        }
      }

      //check if token is still valid - do a test api call
      api.get("/healthworkers/verify/"+storedUser.id, userToken)
        .then(res => {
          //relogin so as to stay new token details
          dispatch({type: 'LOGIN', healthworker:{login: true, id: res.data._id, token: res.data.token, fname: res.data.fname, lname: res.data.lname}});
          setLogout(false)
        })
        .catch(err => {
          setLogout(true)
          history.push("/healthworker/logout")
        })


    }else{
      //no token so redirect to login page
      setLogout(true)
      dispatch({type: 'LOGOUT'});
      if(location.pathname === "/login"){
        history.push("/login")
      }else{
        history.push("/signup")
      }
      
    }

  }, [location.pathname])

  useEffect(() => {
    
    const { pathname } = location;
    if(pathname === "/patients" || pathname === "/healthworkers" || pathname === "/signup" || pathname === "/login" || pathname.startsWith("/dashboard/") || pathname === ("/healthworker/logout")){
      setShowPatientMenu(false)
    }
    if(pathname.startsWith("/patients/biodata/") || pathname.startsWith("/patients/anthropometrics/") || pathname.startsWith("/patients/symptoms/") || pathname.startsWith("/patients/diagnostics/")){
      setShowPatientMenu(true)
      setOpenNested(true)
      let path_data = pathname.split("/")
      let patient_id = path_data[path_data.length - 1]
      setPatientId(patient_id)
    }
  }, [location.pathname]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Medilinkup
          </Typography>

          {patientMenu
          ? <div>
            <Button onClick={() => history.push("/patients/biodata/"+ patientId)} color="inherit">Bio</Button>
            <Button onClick={() => history.push("/patients/anthropometrics/"+ patientId)} color="inherit">Anthropometrics</Button>
            <Button onClick={() => history.push("/patients/symptoms/"+ patientId)} color="inherit">Symptoms</Button>
            <Button onClick={() => history.push("/patients/diagnostics/"+ patientId)} color="inherit">Diagnostics</Button>
            <Button onClick={() => history.push("/patients/charts/"+ patientId)} color="inherit">Charts</Button>
            </div>
          : <div></div>
          }

          
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <div className={classes.logo}>
            <h2>MEDILINKUP</h2>
          </div>

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        {!logout ?
        <div>
        <List component="nav" aria-label="main mailbox folders" style={{paddingRight: 15}}>
          <ListItem className={classes.listItems} button onClick={() => history.push("/healthworkers")}>
            <ListItemIcon>
              <Avatar maxInitials={1} size={40} round={true} name={healthworker.firstname} />
            </ListItemIcon>
            <ListItemText primary={healthworker.firstname + " " + healthworker.lastname} />
          </ListItem>
        </List>
        </div>
        :<div></div>}
        <Divider />
        <Divider />
          {!logout ?
          <div>
          <List component="nav" aria-label="main mailbox folders" style={{paddingRight: 15}}>
            <ListItem className={dashClicked ? classes.listItemDone : classes.listItems} button onClick={handleDashboardClick}>
              <ListItemIcon>
                <DashboardIcon className={classes.icon_color} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem className={profileClicked ? classes.listItemDone : classes.listItems} button onClick={handleProfileClick}>
              <ListItemIcon>
                <AccountCircleIcon className={classes.icon_color} />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem className={doctorClicked ? classes.listItemDone : classes.listItems} button onClick={handleDoctorClick}>
              <ListItemIcon>
                <Badge color="secondary" badgeContent={countDoctors}>
                    <LocalHospitalIcon className={classes.icon_color} />    
                  </Badge>
              </ListItemIcon>
              <ListItemText primary="Doctors" />
            </ListItem>

            <ListItem className={classes.listItems} button onClick={handleClick}>
              <ListItemIcon>
              <Badge color="secondary" badgeContent={countPatient}>
                <GroupIcon className={classes.icon_color} />   
              </Badge>
                
              </ListItemIcon>
              <ListItemText primary="Patients" />
              {openNested ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openNested} timeout="auto" unmountOnExit>
              <List component="div" style={{paddingRight: 10}}>
                <ListItem className={patientClicked ? classes.nestedDone : classes.nested} button onClick={handlePatientsClick} >
                  <ListItemIcon>
                    <Badge color="secondary" badgeContent={countPatient}>
                      <ViewListIcon className={classes.icon_color} />    
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="List" />
                </ListItem>

              {patientMenu
              ?
                <div>
                <ListItem button onClick={handleBioClick} className={bioClicked ? classes.nestedDone : classes.nested}>
                  <ListItemIcon>
                    <FingerprintIcon className={classes.icon_color} />
                  </ListItemIcon>
                  <ListItemText primary="Bio" />
                </ListItem>

                <ListItem button onClick={handleMetricClick} className={metricClicked ? classes.nestedDone : classes.nested}>
                  <ListItemIcon>
                    <Badge color="secondary" badgeContent={countMetrics}>
                      <PersonIcon className={classes.icon_color} />    
                    </Badge>

                  </ListItemIcon>
                  <ListItemText primary="Anthropometrics" />
                </ListItem>

                <ListItem button onClick={handleSymClick} className={symClicked ? classes.nestedDone : classes.nested}>
                  <ListItemIcon>
                    <Badge color="secondary" badgeContent={countSymptoms}>
                      <StarBorder className={classes.icon_color} />    
                    </Badge>

                  </ListItemIcon>
                  <ListItemText primary="Symptoms" />
                </ListItem>

                <ListItem button onClick={handleDiaClick} className={diaClicked ? classes.nestedDone : classes.nested}>
                  <ListItemIcon>
                    <Badge color="secondary" badgeContent={countDiagnostics}>
                      <RadioButtonCheckedIcon className={classes.icon_color} />    
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="Diagnostics" />
                </ListItem>

                <ListItem button onClick={() => history.push("/patients/charts/"+ patientId)} className={classes.nested}>
                  <ListItemIcon>
                    <TimelineIcon className={classes.icon_color} />
                  </ListItemIcon>
                  <ListItemText primary="Charts" />
                </ListItem>
                </div>
              : <div></div>
              }
              </List>
            </Collapse>

            <ListItem className={classes.listItems} button onClick={handleLogout}>
              <ListItemIcon>
                  <ExitToAppIcon className={classes.icon_color} />    
              </ListItemIcon>
              <ListItemText primary="LOGOUT" />
            </ListItem>
          </List>
          </div>
          :<div></div>
          }

  
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
          <div className={classes.toolbar} />
        
            <div>
                {iserror && 
                    <Alert severity="error">
                        {errorMessages.map((msg, i) => {
                            return <div key={i}>{msg}</div>
                        })}
                    </Alert>
                }

          <Switch>
            <Route exact path="/healthworkers" component={HealthWorkers} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/dashboard/:id" component={Dashboard} />
            <Route exact path="/profile/:id" component={Profile} />
            <Route exact path="/healthworkers" component={HealthWorkers} />
            <Route exact path="/healthworker/logout" component={SignedOut} />
            <Route exact path="/patients" component={Patients} />
            <Route exact path="/patients/dashboard/:id" component={Dashboard} />
            <Route exact path="/patients/biodata/:id" component={Bio} />
            <Route exact path="/patients/anthropometrics/:id" component={Metrics} />
            <Route exact path="/patients/symptoms/:id" component={Symptoms} />
            <Route exact path="/patients/diagnostics/:id" component={Diagnostics} />  

          </Switch>
        </div>

      </main>
    </div>
  );
}