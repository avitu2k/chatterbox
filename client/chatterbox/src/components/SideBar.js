import React, {useState, useEffect, useContext} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {RoomsContext, CurrentRoomIdContext } from '../Utils/contexts'
import {Grid, List, Drawer, Divider} from "@material-ui/core"
import RoomItem from './RoomItem'
import OptionsMenu from './OptionsMenu'
import AddRoomButtons from './AddRoomButtons'
 

const drawerWidth = '20%';
const drawerHeight = '82%';

const useStyles = makeStyles(() => ({
  root: {           
    backgroundColor : '#9370DB',    
    color : '#FFFAF0',       
  },
  drawer: {
    flexShrink: 0,      
  },
  drawerPaper: {
    position: 'absolute',
    marginTop: '4.3%',
    marginBottom : '100%',
    backgroundColor : '#9370DB', 
    color : '#FFFAF0',
    width : drawerWidth, 
    maxHeight : drawerHeight
  },
  drawerContainer: {
    backgroundColor : '#9370DB',
    color : '#FFFAF0',
  },
}));


function SideBar() {
    const [selectedIndex, setSelectedIndex] = useState(null);      
    const [anchorEl, setAnchorEl] = useState(null);   
    const rooms = useContext(RoomsContext);       
    const {currentRoomId} = useContext(CurrentRoomIdContext);    
    const classes = useStyles();    

    useEffect(()=>{
      let index = rooms.findIndex(room=> room.id === currentRoomId);
      if(index >= 0)
      {
        setSelectedIndex(index);
      }
    },[currentRoomId, rooms])
    
  const roomItemProps = {
    setAnchorEl, anchorEl, selectedIndex, setSelectedIndex   
  }

  const menuItemProps = {setAnchorEl, anchorEl}
    
  const items = rooms.map((room, index) =>{       
      return <RoomItem itemProps = {roomItemProps}  roomId = {room.id}  key={index}/>
  })  

    

    return (
      <div className={classes.root}>        
      <Grid container>
        <Grid item md={12}>
          <Drawer
            className={classes.root}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <List>
              <AddRoomButtons  setSelectedIndex = {setSelectedIndex} key={-1} />
              <Divider />
              <Divider />
              {items}
              <OptionsMenu menuProps = {menuItemProps} key={-2} />  
            </List>
          </Drawer>
        </Grid>
      </Grid>           
    </div>    
    );
}

export default SideBar;