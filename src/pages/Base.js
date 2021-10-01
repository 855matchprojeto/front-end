import React from 'react'
import Header from "../components/Header";
import Copyright from '../components/Copyright';
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

//--estilo--

const useStyles = makeStyles( ({
    container: {
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 64px)",
      paddingLeft: "5%",
      paddingRight: "5%",
      justifyContent: "space-between"
    },
  }));
//---------

const Base = (props) => {

    const classes = useStyles();

    return (
        <>
            <Header />
            <div className={classes.container}>
                {props.children}
                <Box mt={4} mb={4}> <Copyright /> </Box>
            </div>
        </>
    )
}

export default Base;