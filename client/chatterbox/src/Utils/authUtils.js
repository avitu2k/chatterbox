import axios from 'axios';
import {setLoggedUser, getToken, setToken, nullifyToken, nullifyLoggedUser } from './localStorageUtils'


export const loginOrSignup = async(username, password, actionType) =>{
    try{
        const resp = await axios.post(`http://localhost:4000/${actionType}`, {username : username, password : password});
        const accessToken = resp.data.accessToken;
        setToken(accessToken);
        const user = await fetchUser();
        setLoggedUser(user);
        return {success : true , failMessage : null}
    }
    catch(err){ 
        console.log(err.response.data);  
        return {success : false , failMessage : err.response.data}
    }        
}

export const logout = () =>{
    nullifyToken();
    nullifyLoggedUser();
    window.location.reload();        
}

export const fetchUser = async()=>{
    const token = getToken();
    const headers = { headers : { Authorization : 'Bearer ' + token }};
    const resp = await axios.get('http://localhost:5000/users/current', headers);
    return resp.data;                           
}

