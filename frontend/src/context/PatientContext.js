import React, { createContext, useReducer} from 'react';
import { patientReducer } from '../reducers/patientReducer';

export const PatientContext = createContext();

const PatientContextProvider = (props) => {

    const [patientData, dispatchPatient] = useReducer(patientReducer, {num_metrics: 0, num_symptoms: 0, num_diagnostics: 0});
    return (
        <PatientContext.Provider value={{patientData, dispatchPatient}}>
            {props.children}
        </PatientContext.Provider>
    )
}

export default PatientContextProvider;