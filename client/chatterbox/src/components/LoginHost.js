import {React , useState} from 'react';
import {Paper,Tabs, Tab, Container, Box} from '@material-ui/core';
import Login from './Login'
import Signup from './Signup'
import {Switch, Route} from 'react-router-dom'


const LoginHost = ()=> {
    const paperStyle = {  height: '88vh',width: 390, margin:"auto auto" }
    const [value, setValue] = useState(0);    
    const rootStyle = {backgroundColor : '#663399', height: '100vh'}
    const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const SignupPage = () =>{
    return window.location.href.includes("signup") ? true : false
    }

    return ( 
        <div style ={rootStyle}>
        <Paper style ={paperStyle}>
            <Container>
                <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                >
                    <Tab label="Sign in" href = "/login"
                     value={SignupPage() ? 1 : 0} />
                    <Tab label="Sign up" href = "/signup"
                     value={SignupPage() ? 0 :1}/>
                </Tabs>
            </Container>
        <Box>
            <Switch>
             <Route path='/signup'>
                 <Signup/>
             </Route>
             <Route path='/'>
                 <Login />
             </Route>
             </Switch>
        </Box>
        </Paper>   
        </div>        
    );
  }

export default LoginHost;


