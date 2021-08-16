import React, {useEffect, useContext, useState} from 'react';
import {Menu, MenuItem} from "@material-ui/core"
import {UserContext, RoomsContext, CurrentRoomIdContext, SocketMethodsContext} from '../Utils/contexts'

function OptionsMenu({menuProps}) {
    const user = useContext(UserContext);
    const rooms = useContext(RoomsContext);
    const {currentRoomId } = useContext(CurrentRoomIdContext);
    const {blockUser, leaveGroup} = useContext(SocketMethodsContext);
    const [room, setRoom] = useState(null);

    useEffect(()=>{
        let roomIndex = rooms.findIndex(room => room.id === currentRoomId);
        if(roomIndex >= 0 ){
           setRoom(rooms[roomIndex]);
        } 
          
      },[rooms, currentRoomId])

      const clickBlock = () =>{
          menuProps.setAnchorEl(null);
          const otherUserId = room.members[0].memberId === user._id ? room.members[1].memberId : room.members[0].memberId;
          blockUser(user._id, otherUserId, room.id);
      }

      const clickLeave = () =>{
        menuProps.setAnchorEl(null);
        leaveGroup();     
      }

    if(room){
        return (
            <Menu                
                  open={Boolean(menuProps.anchorEl)}
                  anchorEl={menuProps.anchorEl}
                  keepMounted                
                  onClose={(e) => {menuProps.setAnchorEl(null)}}
               >
                {room.isGroup ? 
                    <MenuItem onClick = {e => clickLeave()} 
                    >Leave Group</MenuItem>
                    :
                    <MenuItem onClick = {e => clickBlock()}>
                    Block User</MenuItem>       
                 }
            </Menu>
        );
    }
    else{
        return ''
    }
}

export default OptionsMenu;