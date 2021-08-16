import React, {useState } from 'react';
import {loginOrSignup} from '../Utils/authUtils'
import {Grid, Paper,Snackbar, Avatar, TextField,Button, Typography, Link} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup'


const LoginComp = ()=> {

    const [showSuccessAlert, setSuccess] = useState(false);
    const [showFailAlert, setFail] = useState(false);   
    const paperStyle = { padding: 20, height: '70vh',width: 340, margin:"20px auto"}
    const avatarStyle = { backgroundColor : '#178ab8'}
    const btStyle = { margin:"12px 0"}
    const tfStyle = { margin:"8px 0"}
    const emStyle = {color : '#FA8072'} 

    const initialValues = { username :"", password:""}

    const onSumbit = async(values)=>{
        const answer = await loginOrSignup(values.username, values.password, 'login');
        if(!answer.success){
            setFail(true);
            setSuccess(false);
        }
        else{
            setSuccess(true);
            setFail(false);
            setTimeout(()=> {
                window.location.reload();
            },1000)
        }
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Required'),
        password: Yup.string().min(4).required("password must be at least 4 characters long"),
    })
  
    return (       
         <Grid>
             <Paper elevation = {10} style ={paperStyle}>
                 <Grid align='center'>
                     <Avatar style = {avatarStyle}> <LockTwoToneIcon /></Avatar>
                        <h2>Sign in to ChatterBox</h2>
                 </Grid>          
                <Formik 
                initialValues = {initialValues}
                onSubmit = {onSumbit}
                validationSchema = {validationSchema}>
                    {() =>(
                        <Form>
                        <Field as={TextField} label = 'Username' variant="outlined" 
                        placeholder='Enter Username'  fullWidth name='username'
                        style={tfStyle} 
                            helperText = {<span style={emStyle}><ErrorMessage name='username' />
                            </span>} />
                        <Field as={TextField} label = 'Password' variant="outlined" 
                            placeholder='Enter Password'  name='password' fullWidth
                            style={tfStyle} type= "password"
                            helperText = {<span style={emStyle}><ErrorMessage name='password' />
                            </span>}/>
                    <Button type = 'submit' variant="contained" color="primary" fullWidth
                            style = {btStyle} >
                        Sign in</Button>
                        </Form>
                    )}                    
                </Formik>
                <Typography > Don't have an account yet ? {' '} 
                <Link href="/auth/register" >
                    Sign up 
                </Link>    
                </Typography> 
                <Snackbar open={showSuccessAlert}
                autoHideDuration={6000} >
                <Alert variant="filled" severity="success">
                Youv'e successfuly signed in , enjoy !
                </Alert>
                </Snackbar>
                <Snackbar open={showFailAlert}
                    autoHideDuration={6000} >
                    <Alert variant="filled" severity="error">
                    username or password are incorrect 
                    </Alert>
                </Snackbar>
             </Paper>
         </Grid> 
      
    );
  }

export default LoginComp;





  
