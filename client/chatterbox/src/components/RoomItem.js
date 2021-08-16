import React, {useEffect, useContext, useState} from 'react';
import MuiListItem from "@material-ui/core/ListItem";
import {withStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MailIcon from '@material-ui/icons/Mail';
import {ListItemText, Badge, Box, CircularProgress} from "@material-ui/core"
import {UserContext, RoomsContext, CurrentRoomIdContext} from '../Utils/contexts'


const ListItem = withStyles({
    root: {
      height : '60px',
      "&$selected": {
        backgroundColor: "#6495ED",
      },
      "&$selected:hover": {
        backgroundColor: "#6495ED",
      },
      "&:hover": {
        backgroundColor: "#6495ED",
      }
    },
    selected: {}
  })(MuiListItem);

function RoomItem({itemProps, roomId}) {
    const user = useContext(UserContext);
    const rooms = useContext(RoomsContext);
    const {currentRoomId, setCurrentRoomId} = useContext(CurrentRoomIdContext);
    const [room, setRoom] = useState(null);
    const [roomName, setRoomName] = useState(null);
    const [index, setIndex] = useState(null);       
    const [showOptions, setShowOptions] = useState(false);
    const [numOfUnreadMessages, setNumOfUnreadMessages] = useState(false);   
    const history = useHistory();
    const iButtonStyle = {marginTop : '15%', marginLeft:'10%'};


    useEffect(()=>{     

      let roomIndex = rooms.findIndex(room => room.id === roomId);
      if(roomIndex >= 0 ){
         setRoom(rooms[roomIndex]);
         setIndex(roomIndex);
      }      
    },[rooms, roomId])

    useEffect(()=>{      
      const getNameOfTheOtherUserInTheChat = () =>{
        return room.members[0].memberId === user._id ?
                   room.members[1].memberName: 
                   room.members[0].memberName;
      }  

      const CheckNumOfUnredMessages = ()=>{
        if(currentRoomId === room.id){
          setNumOfUnreadMessages(0);
        }
        else{
          let count = 0;
          room.messages.forEach(message =>{
            if(!message.readBy.includes(user._id)){
                count++;
            }
          })
          setNumOfUnreadMessages(count);
        }
      }    

      if(room){
        if(room.isGroup === false){
          let name = getNameOfTheOtherUserInTheChat();
          setRoomName(name);
        }
        else{
          setRoomName(room.name)
        }
        CheckNumOfUnredMessages();        
      }       
    },[room, user, currentRoomId])

    

    const handleRoomClick = () => {     
      setCurrentRoomId(room.id);
      itemProps.setSelectedIndex(index);        
      history.push('/');  
    }; 

    const optionsClick = (e)=>{
        itemProps.setAnchorEl(e.target)
    }
    

    if(room){
      return (
        <ListItem button key={index}                    
        selected = {itemProps.selectedIndex === index}
        onMouseEnter = {(e) => setShowOptions(true)}
        onMouseLeave= {(e) => setShowOptions(false)}
        onClick={() => handleRoomClick()}           
        >
        <ListItemText primary={roomName} />
        <Box visibility={numOfUnreadMessages > 0 ? "visible" : "hidden"}>
          <Badge badgeContent={numOfUnreadMessages} >
            <MailIcon />
          </Badge>
        </Box> 
        <Box visibility={showOptions ? "visible" : "hidden"}>
          <div style={{iButtonStyle}} onClick={(e) => optionsClick(e) } >
            <ExpandMoreIcon /> 
          </div>
        </Box>              
        </ListItem>
      );
    }
    else{
      return <CircularProgress /> 
    }    
}

export default RoomItem;


