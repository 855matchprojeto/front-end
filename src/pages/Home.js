import React, { useState, useEffect } from 'react';
import Cards from "../components/Cards";
import { Container, createTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";

//--estilo--
const theme = createTheme();

const useStyles = makeStyles( ({
  grid: {
    marginTop: theme.spacing(2),
  },
}));
//---------

const Home = () => {
  const classes = useStyles();

  //const [cardsProjetos, setCardsProjetos] = useState(null);
  /*
  useEffect(() => 
  {
      async function getProjetos() {
 
      }
      
      getProjetos();

  }, [])
  */

  return (
      <Container className={classes.grid} maxWidth="lg">
        <Cards />
      </Container>
  );
};

export default Home;
