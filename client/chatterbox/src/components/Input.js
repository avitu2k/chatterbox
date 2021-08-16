import React, {useContext, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Button} from '@material-ui/core/';
import SendIcon from '@material-ui/icons/Send';
import { SocketMethodsContext } from '../Utils/contexts';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: '1',
    marginRight: theme.spacing(0),
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(-1),
    width:'100%',
    display : 'flex',
    flexDirection : 'row', 
    flexWrap : 'nowrap',
  },
  textField: {

  },
  button: {    
    marginLeft: theme.spacing(0),
    marginTop: theme.spacing(2.02), 
    height : '70%',   
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  }
}));

export default function Input() {
  const classes = useStyles();
  const [text, setText] = useState('');
  const {sendMessage} = useContext(SocketMethodsContext);
  
  const handleSubmit = (e) =>{
     sendMessage(text);
     setText('');
  }

  return (
    <div className={classes.root}>
        <TextField
          className={classes.textField}
          size ="medium"
          id="input"
          label="Press Enter To send"                        
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={text}
          placeholder="type a message"
          onChange = {e => setText(e.target.value)}
          onKeyPress={e => e.key ==='Enter' ? handleSubmit(e) : null}
        />
        <Button variant="outlined" color="primary" className={classes.button}
            onClick = {e => handleSubmit(e)}>
            Send
            <SendIcon className={classes.rightIcon}>send</SendIcon>
        </Button>
    </div>
  );
}
