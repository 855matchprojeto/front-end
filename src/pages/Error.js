import React from "react";
import { Typography,Container,Box, createTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Copyright from "../components/Copyright";

//--estilo--
const theme = createTheme();

const useStyles = makeStyles( ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }
  }));
//---------

const Error = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5"> Erro 404. Página não encontrada. </Typography>
      </div>

      <Box mt={6} mb={4} component={Copyright}/>  
    </Container>
  );
};

export default Error;