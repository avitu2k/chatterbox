import React, {useContext} from 'react';
import {UserContext } from '../Utils/contexts';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    spanny:{ 
        marginTop : '5%',
        textAlign:'left',
        marginLeft: theme.spacing(2),
        color : '#4169E1',
        fontSize : '130%'                  
     },
  }));

function UserListView({userList}) {
    const currentUser = useContext(UserContext);
    const classes = useStyles();

    return (
        <div className = {classes.spanny}>
            <span> participants : </span>
            {userList ?
                userList.map((friend, index)=>{
                if(currentUser._id === friend._id){
                    return <span key ={index}>{'Me'}{' '}</span>
                }
                else{
                    return (
                        <span key ={index}>{', '}{friend.name}</span>
                    )
                }
            }) : null
            }
        </div>          
    );
}

export default UserListView;