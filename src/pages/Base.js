import React from 'react'
import Header from "../components/Header";
import Copyright from '../components/Copyright';
import { Box, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
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
            <OverlayScrollbarsComponent options={{scrollbars:{autoHide:"scroll"}}}>
                <div 
                    className={classes.container}
                     style={{ 
                        padding: matches && '0px', 
                        marginTop: matches ? '0px' :'16px' 
                    }}
                  >
                    {props.children}
                    <Box mt={1} mb={1}>
                      <Copyright/>
                    </Box>
                </div>
            </OverlayScrollbarsComponent>
        </>
    )
}

export default Base;