import React, {useContext} from 'react';
import {Grid, Box, Button} from "@material-ui/core"
import PlusIcon from '@material-ui/icons/AddCircleOutline';
import {isAddGroupPage, isAddChatPage} from '../Utils/urlUtils'
import {makeStyles} from '@material-ui/core/styles';
import {CurrentRoomIdContext } from '../Utils/contexts'


const useStyles = makeStyles((theme) => ({
    button:{   
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(0.5),
      border: "0.5px solid white",
      width : '85%',
      color: "white",
      backgroundColor: '#9370DB'  
    },
    activeButton:{
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(0.5),
      border: "0.5px solid white",
      width : '85%',
      color: "white",
      backgroundColor: "#6495ED"
    },
    buttonContainer:{
        
    },
    icon:{
      marginRight: theme.spacing(1), 
    }
  }));

function AddRoomButtons({setSelectedIndex}){
    const classes = useStyles();
    const {setCurrentRoomId} = useContext(CurrentRoomIdContext);

    const buttonClick = ()=>{
        setCurrentRoomId(null);
        setSelectedIndex(null);
      }

    return (
        <Box className={classes.buttonContainer}>
                <Grid container>
                <Grid item md={6} lg={6} xl={6} sm={12}>
                  <Box mr={-1} ml={3}>
                    <Button
                      className = { isAddChatPage() ? classes.activeButton : classes.button}
                      variant="contained"
                      href="/addchat"
                      onClick = {()=>buttonClick()}
                      >
                      <PlusIcon  className={classes.icon}/> Chat
                    </Button>
                  </Box>
                </Grid>
                <Grid item md={6} lg={6} xl={6} sm={12}>
                  <Box ml={-0.5} mr={2}>
                    <Button className = { isAddGroupPage() ? classes.activeButton : classes.button}
                            variant="contained"  href="/addgroup"
                            onClick = {()=>buttonClick()}                            >
                      <PlusIcon className={classes.icon} /> Group
                    </Button>
                  </Box>
                </Grid>
                </Grid>
        </Box>
    );
}

export default AddRoomButtons;