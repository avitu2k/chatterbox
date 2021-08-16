import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import {useHistory} from 'react-router-dom'
import TopNavBar from './TopNavBar';
import {getLoggedUser, getToken} from '../Utils/localStorageUtils'
import SideBar from './SideBar';
import Loading from './Loading'
import MainContainer from './MainContainer'
import {UserContext, UsersContext, RoomsContext, CurrentRoomIdContext, SocketMethodsContext} from '../Utils/contexts'
import { Grid} from '@material-ui/core/'
import {isMainPage} from '../Utils/urlUtils'

const ENDPOINT = 'localhost:5000';

let socket;


function Chat() {    
    const [user, setUser] = useState(null);   
    const [rooms, setRooms] = useState(null); 
    const [users, setUsers] = useState([]);
    const [connectionError, setConnectionError] = useState(null);  
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const firstDataInizialization = useRef(true);
    const history = useHistory();

    useEffect(()=>{
        socket = io(ENDPOINT, {auth:{token : getToken()}});
        setUser(getLoggedUser());       
    },[]); 
    
    useEffect(()=>{
        const initRooms = (userRooms) =>{
            let arr = [];
            for( let i = 0 ; i< userRooms.length ; i++){ 
                let obj = {
                    id : userRooms[i]._id,
                    name : userRooms[i].name,
                    members : userRooms[i].members,
                    isGroup : userRooms[i].isGroup,
                    messages : userRooms[i].messages,
                }
                arr.push(obj);
            } 
            setRooms(arr);
            setTimeout(() =>{firstDataInizialization.current = false}, 1);                        
        }

        if(user){                         
            socket.emit('fetchData',user._id,({allUsers, userRooms})=>{
                if(allUsers && userRooms && firstDataInizialization.current){
                    // socket.emit('dataReceviedAck', user._id);
                }
                setUsers(allUsers);
                initRooms(userRooms);    
                return () => {
                    socket.off();
                };
            });            
        }        
    }, [user]) 


    useEffect(()=>{
        if(rooms && isMainPage() && firstDataInizialization.current){
            setCurrentRoomId(rooms[0].id);            
        }                           
    },[rooms]);

    useEffect(()=>{        
        socket.on('update',(user)=>{ 
            setUser(user);         
        });

        socket.on('connect_error',(err)=>{ 
            setConnectionError(err);      
        });

        return () => {
            socket.off();
        };        
    },[]);

    const sendMessage = (message)=>{
        const senderId = user._id;
        const roomId = currentRoomId;
        const body = message; 
        const createdTime = new Date();      
        socket.emit('sendMessage',{senderId, roomId, body, createdTime},()=>{
              
        })        
    }

    const createGroup = (groupName, friends) =>{
        let adminId = user._id;
        socket.emit('addGroup',{groupName, friends, adminId});         
    }

    const blockUser = (blockerId, blockedId, roomId) =>{
        socket.emit('blockUser',{blockerId, blockedId, roomId})          
    }

    const leaveGroup = () =>{
        const userId = user._id;
        const roomId = currentRoomId;
        socket.emit('leaveGroup',{userId, roomId});          
    }

    const markMessageAsReadOrDelivered = (messageId, actionType) =>{
        console.log("read")
        const userId = user._id;
        const roomId = currentRoomId;
        socket.emit('markAsReadOrDelivered',{roomId, messageId, userId, actionType});              
    }

    const startChat = (otherUserId)=>{
        let firstUserId = user._id;
        let secondUserId = otherUserId;
        socket.emit('addChat',{firstUserId, secondUserId},(usersExistingRoomIdFromBefore)=>{
            if(usersExistingRoomIdFromBefore){
                setCurrentRoomId(usersExistingRoomIdFromBefore);
                history.push('/');
            }
        })           
    }

    const dataInitialized = ()=>{        
        if(!user || !rooms){
            return false
        }
        return true
    }

    const socketMethods = {startChat, createGroup, sendMessage, markMessageAsReadOrDelivered, blockUser, leaveGroup};

    if(connectionError){
        return <h3>{connectionError.message}</h3>
    }
    else if(!dataInitialized()){
        return <Loading />
    }
    else{
        return (
            <div>
            <UserContext.Provider value={user}>
            <RoomsContext.Provider value={rooms}>
            <CurrentRoomIdContext.Provider value={{currentRoomId, setCurrentRoomId}}>
            <UsersContext.Provider value={users}>
            <SocketMethodsContext.Provider value={socketMethods}>                    
            <Grid item md={12}>
                <TopNavBar />
            </Grid>
            <Grid container style={{maxHeight : '60%'}}>
                <Grid item  xl ={3} lg={3} md={3} sm={3} xs={3}>
                    <SideBar/>
                </Grid>
                <Grid item xl ={9} lg={9} md={9} sm={9} xs={9}>
                    <MainContainer/>
                </Grid>
            </Grid>            
            </SocketMethodsContext.Provider>
            </UsersContext.Provider>             
            </CurrentRoomIdContext.Provider>
            </RoomsContext.Provider>
            </UserContext.Provider> 
            </div>
        );
    }
}




export default Chat;