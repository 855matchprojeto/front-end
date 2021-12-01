import React from "react";
import Cards from "../components/Cards";
import { Container, createTheme, Typography, Pagination, FormControl,InputLabel } from "@mui/material";
import { MenuItem, Select, styled, alpha, InputBase } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import { chunk } from '../services/util';
import { getProjetos } from "../services/api_projetos";
import LoadingBox from "../components/LoadingBox";

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
      width: "20ch",
      "&:focus": {
        width: "25ch",
      },
    },
  },
}));

const useStyles = makeStyles({
  grid: {
    marginTop: theme.spacing(2)
  },

  pagination: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1)
  },
});
//---------

const Home = () => {
  const classes = useStyles();

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = React.useState(true);

  const [cardsProjetos, setCardsProjetos] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [n_cards, setNcards] =  React.useState(10);
  const [pageCount, setPageCount] = React.useState(1);
  const [pesquisa,setPesquisa] = React.useState("");

  function fazerPesquisa(e)
  {
    if (e.key === 'Enter') 
    {
      setPesquisa(e.target.value);
      console.log(pesquisa);
    }
  }
  
  // mudando o número de cards por página, renderiza novamente 
  React.useEffect(() => 
  {
      async function loadProjetos() 
      { 
        setPageLoading(true);

        console.log(pesquisa);

        let valores = await getProjetos(pesquisa);
        let x = chunk(valores.data,n_cards);
        setCardsProjetos(x);
        setPageCount(x.length);
        
        setPageLoading(false);
      }
      loadProjetos();
  }, [n_cards, pesquisa])

  return (
    <>
      { !pageLoading &&
        <Container className={classes.grid} maxWidth="lg">

          <Typography variant="h6"> Projetos </Typography>
          
          <SearchBox>
              <SearchField>
                <SearchIcon />
                <StyledInput 
                  placeholder="Buscar projetos..." 
                  inputProps={{ 'aria-label': 'search' }} 
                  onKeyPress={(e) => fazerPesquisa(e)}
                />
              </SearchField>
          </SearchBox>

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
      }

      { pageLoading && <LoadingBox/>}
    </>
  );
};

export default Home;
