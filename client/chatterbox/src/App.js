import './App.css';
import React, {useState, useEffect} from 'react';
import Chat from './components/Chat';
import LoginHost from './components/LoginHost';
import {getLoggedUser} from './Utils/localStorageUtils'
import Loading from './components/Loading'

function App() {

  const [loggedIn, setLoggedIn] = useState();
  const [dataReady, setDataReady] = useState(false);

  useEffect(()=>{
    setLoggedIn(getLoggedUser());
    setDataReady(true);
  },[]);  

  if(dataReady){
    return (
      (loggedIn && <Chat/>) || ( !loggedIn && <LoginHost/> )
   )   
  }
  else{
    return <Loading />
  } 
}

export default App;
