import React, { createContext, useReducer} from 'react';
import { menuReducer } from '../reducers/menuReducer';

export const MenuContext = createContext();

const MenuContextProvider = (props) => {

    const [state, dispatched] = useReducer(menuReducer, {num_doctors: 0, num_patients: 0});
    return (
        <MenuContext.Provider value={{state, dispatched}}>
            {props.children}
        </MenuContext.Provider>
    )
}

export default MenuContextProvider;