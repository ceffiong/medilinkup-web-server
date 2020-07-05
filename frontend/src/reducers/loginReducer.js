
export const loginReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            localStorage.setItem("login", JSON.stringify({
                login: action.healthworker.login,
                id: action.healthworker.id,
                fname: action.healthworker.fname,
                lname: action.healthworker.lname,
                token: action.healthworker.token
            })); 

            return {
                ...state,
                login: action.healthworker.login,
                id: action.healthworker.id,
                fname: action.healthworker.fname,
                lname: action.healthworker.lname,
                token: action.healthworker.token
              };

        case 'LOGOUT':
            localStorage.clear();
            return {
                ...state,
                login: false,
                id: '',
                token: '',
                fname: '',
                lname: ''
            };
        default:
            return state;
    }
}