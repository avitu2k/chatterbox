import React from 'react';
import {Box} from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles';
import {Switch, Route} from 'react-router-dom'
import Messages from './Messages'
import Input from './Input'
import AddChat from './AddChat'
import AddGroup from './AddGroup'

const useStyles = makeStyles((theme) => ({

    mContainer: { 
      display: 'flex', 
      flexWrap: 'wrap',    
      marginTop: '4.8%',
      marginLeft: '-4.5%',     
      position: 'absolute',
      height: '81%',     
      width: '63.5%',                
    }, 

    addContainer: { 
        backgroundColor : '#DCDCDC',
        height: '103.5%' ,
        width: '100%',
        textAlign : 'left'               
    }, 

    chatroomContainer: {
        display: 'flex',
        flexDirection : 'column',
        height: '100%',     
        width: '100%',  
        flexWrap : 'nowrap',      
    }
  }));

function MainContainer() {
    const classes = useStyles();
    return (                    
        <Box className = {classes.mContainer}>
            <Switch>
                <Route path='/addchat'>
                    <AddChat/>
                </Route>
                <Route path='/addgroup'>
                    <AddGroup/>
                </Route>
                <Route path='/'>
                    <Box className = {classes.chatroomContainer}>
                        <Messages id="msgs"/>
                        <Input id="input"/>
                    </Box>
                </Route>
            </Switch>
        </Box>
    );
}

export default MainContainer;