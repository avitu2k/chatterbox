import React, {useContext} from 'react';
import { UsersContext, UserContext } from '../Utils/contexts';
import { makeStyles } from '@material-ui/core/styles';
import { Select, MenuItem } from '@material-ui/core/'

const useStyles = makeStyles((theme) => ({
    selectMe: {        
        width: '45vh',        
    }   
  }));

function SelectUsers({setSelectedUser, userList}) {
    const users = useContext(UsersContext);
    const user = useContext(UserContext);
    const currentUser = useContext(UserContext);
    const classes = useStyles();

    const isBlocked = (id)=>{
        return user.blocked.includes(id) ? true : false 
    }

    const userAlreadySelected = (id)=>{
        let answer = false;
        if(userList){
            let index = userList.findIndex(user=> user._id === id);
            if(index !== -1){
                answer = true;
            }
        }        
        return answer;
    }
    
    const items = users.map((user, index) =>{
        if(user._id !== currentUser._id && !isBlocked(user._id) && !userAlreadySelected(user._id)){
            return (
                <MenuItem key={index} value={user.name}
                 onClick={(e)=> setSelectedUser(user)}>
                <em>{user.name}</em>                
                </MenuItem> 
            )
        }
        else{
            return <div/>
        }
    })


    return (
            <Select className = {classes.selectMe}>
                {items}
            </Select>             
    );
}

export default SelectUsers;