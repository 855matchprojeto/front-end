import React from "react";
import Header from "../components/Header";
import Copyright from "../components/Copyright";
import { Box, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getPrefMode } from "../services/util";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
//--estilo--

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 64px)",
    paddingLeft: "5%",
    paddingRight: "5%",
    justifyContent: "space-between",
  },
}));
//---------

const Base = (props) => {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width: 900px)");

  return (
    <>
      <Header />
      <OverlayScrollbarsComponent
        className={(getPrefMode() === 'dark') ? "os-theme-light" : "os-theme-dark"}
        options={{ scrollbars: { autoHide: matches ? "scroll" : "never"} }}
      >
        <div className={classes.container}>
          {props.children}
          <Box mt={1} mb={1}>
            <Copyright />
          </Box>
        </div>
      </OverlayScrollbarsComponent>
    </>
  );
};

export default Base;
