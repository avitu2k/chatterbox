import React, {useState } from 'react';
import {loginOrSignup} from '../Utils/authUtils'
import {Grid, Paper,Snackbar, Avatar, TextField, Button, Typography, Link} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'


const SignupComp = ()=> {
    const [showSuccessAlert, setSuccess] = useState(false);
    const [showFailAlert, setFail] = useState(false);
    const [failMessage, setFailMessage] = useState(null);
    const paperStyle = { padding: 20,width: 340, height: '70vh', margin:"20px auto" }
    const avatarStyle = { backgroundColor : '#178ab8'}
    const btStyle = { margin:"10px 0"}
    const tfStyle = { margin:"8px 0"}
    const hdrStyle = { padding: 0}
    const emStyle = {color : '#FA8072'}    

    const initialValues = { username :"", password:""}

    const onSumbit = async(values)=>{ 
        const answer =  await loginOrSignup(values.username, values.password, 'signup');              
        if(!answer.success){
            setFail(true);
            setSuccess(false);
            setFailMessage(answer.failMessage);
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
                    <Avatar style = {avatarStyle}> <AddIcon /></Avatar>
                    <h2>Sign up to ChatterBox</h2>
                <h8 style ={hdrStyle}>please fill this form to create an account</h8> 
                </Grid>
                <Formik 
                initialValues = {initialValues}
                onSubmit = {onSumbit}
                validationSchema = {validationSchema}>
                {() =>(
                <Form>                  
                <Field as={TextField} label = 'Username' variant="outlined"  placeholder='Enter Username' 
                        fullWidth style={tfStyle} name='username'
                        helperText = {<div style={emStyle}><ErrorMessage name='username' /></div>}  /> 

                <Field as={TextField} label = 'Password' variant="outlined"  placeholder='Enter Password' 
                        fullWidth style={tfStyle} type= "password" name='password'
                        helperText = {<div style={emStyle}><ErrorMessage name='password' /></div>} />  
                            
                <Button type = 'submit' variant="contained" color="primary" fullWidth
                        style = {btStyle} >
                    Sign up</Button>
                 </Form>
            )}                    
            </Formik> 
            <Typography > already have an account ? {' '} 
            <Link href="/auth" >
                Sign in 
            </Link>    
            </Typography>
            </Paper>
            <Snackbar open={showSuccessAlert}
                autoHideDuration={6000} >
                <Alert variant="filled" severity="success">
                Youv'e successfuly signed up , enjoy !
                </Alert>
            </Snackbar>
            <Snackbar open={showFailAlert}
                autoHideDuration={6000} >
                <Alert variant="filled" severity="error">
                {failMessage}
                </Alert>
            </Snackbar> 
         </Grid> 
    );
  }

export default SignupComp;




