import React from 'react'
import Header from "../components/Header";
import Copyright from '../components/Copyright';
import { Box, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";

//--estilo--

const useStyles = makeStyles(theme => ({
    container: {
      display: "flex",
      flexDirection: "column",
      paddingLeft: "5%",
      paddingRight: "5%",
      justifyContent: "space-between",
    },
  }));
//---------

const Base = (props) => {
    const matches = useMediaQuery('(max-width: 600px)');

    const classes = useStyles();

    return (
        <>
            <Header />
            <div 
                className={classes.container} 
                style={{ 
                    padding: matches && '0px', 
                    marginTop: matches ? '0px' :'16px' 
                }}
            >
                {props.children}
                <Box mt={6} mb={4} component={Copyright}/>
            </div>
        </>
    )
}

export default Base;