import React from 'react';
import {LinearProgress} from '@material-ui/core/'

function Loading() {
    const loadingStyle = {
        marginTop : '15ch',
        marginLeft : '5ch',
        marginRight : '5ch'
    };

    return (
        <div style = {loadingStyle}> 
                <LinearProgress /> Loading...                
        </div>
    );
}

export default Loading;