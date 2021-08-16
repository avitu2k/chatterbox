import React, { useEffect, useContext, useRef, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {RoomsContext, CurrentRoomIdContext} from '../Utils/contexts';
import Message from './Message';
import RoomTopBar from './RoomTopBar';
import './Messages.css'

const useStyles = makeStyles((theme) => ({

  root: {  
    flex: '7',    
    width: '100%',
    overflowY : 'auto',
    backgroundColor : '#DCDCDC', 
    '&::-webkit-scrollbar': {
      width: '1em',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#E6E6FA',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#9400D3',
    },
    '&::-webkit-scrollbar-button':{
      
    }    
  },
  container: {    
    width: "100%",    
  },
}));


export default function Messages() {
  const classes = useStyles();
  const rooms = useContext(RoomsContext);
  const {currentRoomId} = useContext(CurrentRoomIdContext);
  const [room, setRoom] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(()=>{
    let index = rooms.findIndex(room => room.id === currentRoomId);
    if(index >= 0 ){
       setRoom(rooms[index]);
       scrollToBottom();
    }        
  },[rooms, currentRoomId])

  useEffect(() => {
    scrollToBottom();
  }, [room]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const messages = room.messages?.map((message, index) => {                     
    return <Message message={message} room={room} index ={index} key={message._id}/>                                 
  });

  return (
      <div className={classes.root} > 
          {/* <RoomTopBar room = {room}/>                */}
          <div className={classes.container}>          
            {messages}   
            <div ref={messagesEndRef} />
          </div>
      </div>           
  );
}
