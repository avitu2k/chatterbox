import React, { useEffect, useContext} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {UserContext, SocketMethodsContext} from '../Utils/contexts';
import DoneAllIcon from '@material-ui/icons/DoneAll';


const useStyles = makeStyles(theme => ({
  bubbleContainer: {
    width: "100%",
    display: "flex"
  },
}));

const Message = ({message, room, index}) => {
  const classes = useStyles();
  const currentUser = useContext(UserContext);
  const {markMessageAsReadOrDelivered} = useContext(SocketMethodsContext);  
  
  const readDeliveredIconStyle = () =>{
    const style = {
      color : message.readByAll ?  'blue':'#A9A9A9',
    }
    return style;
  }

  useEffect(()=>{ 
    if(!message.readByAll && !message.readBy.includes(currentUser._id)){
      markMessageAsReadOrDelivered(message._id, "read");
    } 
  },[])
  

  const bubbleStyle = () =>{
    const style = {
      border: "0.5px solid black",
      display: "flex",
      borderRadius: "10px",
      margin: "5px",
      padding: "10px",
      display: "inline-block",
      backgroundColor : direction === 'left' ? '#0000CD' : '#99ff99', 
      color : direction === 'left' ? 'white' : 'black',
      fontSize : '120%'
    }
    return style;
  } 

  
  const lastMessageWasSentBySameUser = (index) =>{
    let answer = false;
    if( index > 0 ){
        if(room.messages[index].fromId === room.messages[index-1].fromId ){
          answer = true;
        }
    }
    return answer
  }

  const getSenderNameToPresent = (index, isSentByThisUser )=>{
    let answer = '';
    if(!isSentByThisUser && !lastMessageWasSentBySameUser(index)){
      let memberIndex = room.members.findIndex(member => member.memberId === room.messages[index].fromId);                        
      if(memberIndex >=0){
        answer = room.members[memberIndex].memberName;
      }
    }
    return answer;
  }  

  let messageSentByThisUser = message.fromId === currentUser._id;
  let senderNameToPresent = getSenderNameToPresent(index, messageSentByThisUser);
  let direction = messageSentByThisUser ? "right" : "left" ;

  return (
        <div className={`${classes.bubbleContainer} ${direction}`} key={index} >
        <div  style={bubbleStyle()}>
          <div className = "username">{senderNameToPresent}</div>
          <div >{message.body}</div>
          {messageSentByThisUser && <DoneAllIcon style={readDeliveredIconStyle()}/>}
        </div>
        </div>
  )
};

export default Message;