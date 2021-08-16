import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {logout} from '../Utils/authUtils'

const useStyles = makeStyles((theme) => ({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor : '#4B0082',
      marginRight: '16%',
      width:"85%",
    },
    soButton: {     
      color : 'white',
      fontSize : 'medium'       
    },
    typo:{
      flex : 1
    }
  }));

function TopNavBar() {
    const classes = useStyles();
    return (
        <AppBar className={classes.appBar} >
        <Toolbar>
          <Typography variant="h6" className={classes.typo} noWrap>
            ChatterBox
          </Typography>        
        <IconButton className={classes.soButton} onClick = {() => logout()}>
            <ExitToAppIcon  fontSize = 'medium'/> 
        </IconButton> 
        </Toolbar>       
        </AppBar>
    );
}

export default TopNavBar;