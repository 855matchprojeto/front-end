import React, { useState, useEffect } from 'react';
import Cards from "../components/Cards";
import { Container, createTheme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

//--estilo--
const theme = createTheme();

const SearchBox = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',

  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  }
}));

const SearchField = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: "#CFCFCF",
  '&:hover': {
    backgroundColor: alpha("#CFCFCF", 0.5),
  },
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    backgroundColor: "inherit",
    
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

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
        
        <SearchBox>
            <SearchField>
              <SearchIcon />
              <StyledInput placeholder="Pesquisar" inputProps={{ 'aria-label': 'search' }}/>
            </SearchField>
        </SearchBox>

        <Typography variant="h6"> Projetos </Typography>
        <Cards />

      </Container>
  );
};

export default Home;
