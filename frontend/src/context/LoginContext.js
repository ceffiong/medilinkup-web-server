import React, { createContext, useReducer} from 'react';
import { loginReducer } from '../reducers/loginReducer';

export const LoginContext = createContext();

const LoginContextProvider = (props) => {

    const [healthworker, dispatch] = useReducer(loginReducer, []);
    return (
        <LoginContext.Provider value={{healthworker, dispatch}}>
            {props.children}
        </LoginContext.Provider>
    )
}

export default LoginContextProvider;