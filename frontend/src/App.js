import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Main from './components/main/Main'
import LoginContextProvider from './context/LoginContext'
import MenuContextProvider from './context/MenuContext'
import PatientContextProvider from './context/PatientContext'



function App() {
  return (
    <div className="App">
      <Router>
      <Switch>
        <LoginContextProvider>
        <MenuContextProvider>
        <PatientContextProvider>
        <Route path="/" component={Main} />
        </PatientContextProvider>
        </MenuContextProvider>
        </LoginContextProvider>
      </Switch>
      </Router>
      
    </div>
  );
}

export default App;
