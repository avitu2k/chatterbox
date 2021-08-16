import React, {useEffect} from 'react';
import {AppBar, Toolbar} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    roomBar: {
      flexGrow: 1,
      backgroundColor : '#E6E6FA',
      height : '9%'
    },
    first: {
      marginBottom : '2%',
      color : 'black',
      fontSize : 'large',
      fontFamily: "Times New Roman",
      marginLeft : '-2%'
    },
    rest : {
        marginBottom : '2%',
        color : 'black',
        fontSize : 'large',
        fontFamily: "Times New Roman",
        marginLeft : '1%'
    },
    title: {
      flexGrow: 1,
    },
  }));

function RoomTopBar({room}){
    const classes = useStyles();
    
    

    return (
    <AppBar className={classes.roomBar} position="sticky">
        <Toolbar>
            {room.members?.map((member, index) =>{
                return <span key={index} className={index === 0 ? classes.first : classes.rest}>
                        {member.memberName} {index === room.members.length - 1 ?  "" : ','}
                        </span>                  
            })}            
        </Toolbar>
    </AppBar>
    );
}

export default RoomTopBar;