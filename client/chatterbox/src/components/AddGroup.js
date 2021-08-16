import React, {useState, useContext} from 'react';
import {UserContext, SocketMethodsContext} from '../Utils/contexts';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Card, Typography,Grid, Button, Box, InputLabel, FormControl} from '@material-ui/core/'
import {Formik, Form, FieldArray, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import SelectUsers from './SelectUsers';
import UserListView from './UserListView';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor : '#DCDCDC',
        width: '100%',
        height: '100%',
        textAlign : 'left'    
    },
    cardyCard: {
        marginTop: theme.spacing(5),
        marginBottom: '34%',
        marginLeft: theme.spacing(2),               
        width: '50%',
            
    },
    groupName:{
        marginTop : '1%',
        width:'89.5%',
        marginLeft: theme.spacing(1),
        
    },
    selectMe: { 
        marginTop : '3%',
        marginLeft: theme.spacing(1),       
    },
    addButton:{       
       height:'7ch', 
       marginTop : '6.5%',
       width:'59.5%',
       backgroundColor : '#008080',
       marginLeft: theme.spacing(3), 
    },
    subButton:{       
       height:'7ch', 
       marginTop : '7%',       
       marginLeft: '40%', 
    },
    error:{
       marginLeft: theme.spacing(0),
       color: '#FA8072',
    },    
    friendsError:{
       marginLeft: theme.spacing(2.5),
       marginTop : '1%',
       color: '#FA8072',
    },    
    listyList:{ 
       marginRight: theme.spacing(5),
       marginTop : '6%',            
       backgroundColor : '#ADD8E6',
       height:'17ch',
       width:'70%',              
    },    
    title:{ 
       marginTop : '2%',
       textAlign:'left',
       marginLeft: theme.spacing(2),                  
    },    
    spanny:{ 
       marginTop : '5%',
       textAlign:'left',
       marginLeft: theme.spacing(2),
       color : '#4169E1',
       fontSize : '130%'                  
    },    
  }));

function AddGroup() {
    const currentUser = useContext(UserContext);
    const {createGroup} = useContext(SocketMethodsContext);
    const classes = useStyles();
    const [selectedUser, setSelectedUser] = useState();
    const [userList, setUserList] = useState([currentUser])
    const initialValues = { groupName :"", friends:[currentUser]};

    const onSumbit = (values)=>{
        let idArray = values.friends.map(friend => friend._id);
        createGroup(values.groupName, idArray);
     }

     const validationSchema = Yup.object().shape({
        groupName: Yup.string().required('Required'),
        friends: Yup.array().min(2, 'choose atleast one other user')
    })

    const addUser = (e)=>{
        let arr = [...userList]        
        arr.push(selectedUser);
        setUserList(arr)
    }

  
    return (
            <Box className={classes.root} >
            <Card className = {classes.cardyCard}>
                <Formik
                initialValues = {initialValues}
                onSubmit = {onSumbit}
                validationSchema = {validationSchema}>
                    {() =>(
                    <Form>
                    <Typography className = {classes.title} variant="h5"
                                component="h2" color="textSecondary" >
                        Create a new Group
                    </Typography>
                    <Box mt={3}>
                    <Grid container>
                    <Field as={TextField} label = 'Group Name' variant="filled"
                    placeholder='Group Name'   name='groupName'
                    className ={classes.groupName}
                    helperText = {<div className= {classes.error}>
                                <ErrorMessage name='groupName' />
                                </div>}
                    />
                    <Grid item md={8}>
                    <FormControl className = {classes.selectMe} variant="filled" >
                    <InputLabel id="demo-simple-select-filled-label">
                        User
                    </InputLabel>
                    <SelectUsers setSelectedUser = {setSelectedUser} userList={userList} />
                    </FormControl>                
                    </Grid>
                    <Grid item md={4}>
                    <FieldArray name="friends">{({push}) =>
                        <Button  variant="contained"
                        color="primary"
                        className = {classes.addButton}
                        onClick = {selectedUser ? () => {push(selectedUser); addUser()} : null}
                        type="button"
                         >
                            Add 
                    </Button>
                    }
                    </FieldArray>
                    </Grid>
                    </Grid>
                    <div className= {classes.friendsError}>
                    <ErrorMessage name='friends' />
                    </div>
                </Box>
                    <UserListView userList = {userList}/>
                <Button type = 'submit' variant="contained" color="primary"
                        className = {classes.subButton}
                            >
                    Submit</Button>
                    </Form>
                )}
                </Formik><br/>
            </Card>
            </Box>
    );
}

export default AddGroup;

