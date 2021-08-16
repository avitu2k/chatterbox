import React, {useState, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {SocketMethodsContext } from '../Utils/contexts'

import {Card, Typography, CardContent,Grid, Button, CardActions, Box, InputLabel, FormControl} from '@material-ui/core/'
import SelectUsers from './SelectUsers';

const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor : '#DCDCDC',
      width: '100%',
      height: '100%',
      textAlign : 'left'      
    },
    cardyCard: {
        marginTop: theme.spacing(5),
        marginBottom: '34%',
        marginLeft: theme.spacing(2),               
        width: '50%',
    },
    button:{
       marginTop: theme.spacing(0.25),
       marginLeft: theme.spacing(1),
       height:'95%', 
       width:'70%',
       backgroundColor : '#800080', 
    },
    error:{
       marginLeft: theme.spacing(1),
       color: '#FA8072',
    },    
  }));

function AddChat() {
    const classes = useStyles();
    const [selectedUser, setSelectedUser] = useState();
    const [showError, setShowError] = useState(false);
    const {startChat} = useContext(SocketMethodsContext);

    const handleSubmit = (e) =>{
        if(!selectedUser){
            setShowError(true)
        }
        else{
            startChat(selectedUser._id)
        }
    }

    return (
        <Box className={classes.root} >
        <Card className = {classes.cardyCard}>
        <CardContent>
        <Typography className = {classes.title} variant="h5" component="h2" color="textSecondary" >
          Start a Chat
        </Typography>        
      </CardContent>
      <CardActions>
      <Grid container>
          <Grid item md={9} >
              <FormControl variant="filled" >
                <InputLabel id="demo-simple-select-filled-label">User</InputLabel>
                <SelectUsers setSelectedUser = {setSelectedUser}/>
                </FormControl>                              
          </Grid>     
        <Grid item md={3} >
            <Button variant="contained" color="primary"
                    className = {classes.button}
                    onClick = {e => handleSubmit(e)}>
                Go 
            </Button>           
        </Grid>
        <Box display = {showError ? 'unset' : 'none'}>
                    <div className = {classes.error}> required </div>
        </Box> 
      </Grid>            
      </CardActions><br/>       
        </Card>        
        </Box>               
    );
}

export default AddChat;