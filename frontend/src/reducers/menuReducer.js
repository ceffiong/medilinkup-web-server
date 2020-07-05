
import axios from 'axios'
const api = axios.create({
    baseURL: process.env.REACT_APP_MY_HOST
})

export const menuReducer = (state, action) => {
    switch(action.type){
        case 'GET_NUM_DOCTORS':
            api.get("/healthworkers/number", action.token)
                .then(res => {
                    state.num_doctors = res.data.count
                    return state
                })
                .catch(error=> {
                    state.num_doctors = 0
                    return state
                })
        case 'GET_NUM_PATIENTS':
            api.get("/patients/number")
                .then(res => {
                    state.num_patients = res.data.count
                    return state
                })
                .catch(error=> {
                    state.num_patients = 0
                    return state
                })
        default:
            return state;
    }
}