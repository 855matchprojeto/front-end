import React, { useState, useEffect } from "react";
import Cards from "../components/Cards";
import { Container, createTheme, Typography, Pagination, FormControl,InputLabel,MenuItem,Select } from "@mui/material";
import { makeStyles } from "@mui/styles";

import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

import { chunk } from '../services/util';
import { getProjetos } from "../services/api_projetos";

//--estilo--
const theme = createTheme();

const SearchBox = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",

  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchField = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#CFCFCF",
  "&:hover": {
    backgroundColor: alpha("#CFCFCF", 0.5),
  },
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    backgroundColor: "inherit",

    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const useStyles = makeStyles({
  grid: {
    marginTop: theme.spacing(2),
  },

  pagination: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
  },
});
//---------

const Home = () => {
  const classes = useStyles();
  const [cardsProjetos, setCardsProjetos] = useState(false);
  
  const [page, setPage] = useState(1);
  const [n_cards, setNcards] =  useState(10);
  const [pageCount, setPageCount] = useState(1);

  const [pesquisa,setPesquisa] = useState("");
  
  // mudando o número de cards por página, renderiza novamente 
  useEffect(() => 
  {
      async function loadProjetos() 
      {
        let valores = await getProjetos("");
        let x = chunk(valores.data,n_cards);
        setCardsProjetos(x);
        setPageCount(x.length);
      }
      
      loadProjetos();
  }, [n_cards])

  return (
      <Container className={classes.grid} maxWidth="lg">
        
        <SearchBox>
            <SearchField>
              <SearchIcon />
              <StyledInput placeholder="Pesquisar" inputProps={{ 'aria-label': 'search' }}/>
            </SearchField>
        </SearchBox>

        <Typography variant="h6"> Projetos </Typography>

        <FormControl size="small" variant="standard" style={{marginTop: theme.spacing(2)}}>
          <InputLabel id="lbl-n-cards">Cards</InputLabel>

          <Select 
            labelId="lbl-n-cards" 
            id="select-n-cards" 
            value={n_cards} 
            label="Cards" 
            onChange={(event) => setNcards(event.target.value)}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>

        <Cards valores={cardsProjetos[page-1]}/>

        <Container className={classes.pagination}>
          <Pagination 
            count={pageCount} 
            defaultPage={1}
            page={page} 
            onChange={(event, value) => {setPage(value)}}
            shape="rounded" 
            variant="outlined" 
            color="primary" 
            size="small" 
            showFirstButton 
            showLastButton
          />
        </Container>

      </Container>
  );
};

export default Home;
