import React from "react";
import { Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

//--estilo--
const useStyles = makeStyles( ({
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "calc(100vh - 264px)",
      justifyContent: "center",
    },

    grid: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  }));
//---------

function Error()
{
  const classes = useStyles();

  return (
    <Grid container className={classes.grid}>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5"> Erro 404. Página não encontrada. </Typography>
      </div>
    </Grid>
  );
};

export default Error;