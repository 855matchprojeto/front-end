import React from "react";
import Cards from "../components/Cards";
import { Container, Grid, createTheme, Typography, Pagination, useMediaQuery } from "@mui/material";
import { Autocomplete, Chip, Box, TextField, MenuItem, Stack, styled, alpha, InputBase } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import { chunk } from '../services/util';
import { getProjetos } from "../services/api_projetos";
import { getProfiles } from "../services/api_perfil";
import LoadingBox from "../components/LoadingBox";
import {doGetAllCourses,doGetAllInteresses} from "../services/api_perfil";

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
  borderRadius: "5px",
  "&:hover": {
    backgroundColor: alpha("#CFCFCF", 0.5),
  },
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    backgroundColor: "inherit",

    transition: theme.transitions.create("width"),
    width: "100%",
    marginLeft: "5px",
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  pagination: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(0.5)
  },

  stack: {
    width: "100%", 
  },

  stackMobile: {
    width: "100%",
    maxWidth: 380
  },

  boxIcon: {
    alignItems: "center",
    justifyContent: "center",
    display:"flex", 
    width: '2rem', 
    height: '2rem'
  }
});
//---------

const Home = () => {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width: 600px)');

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = React.useState(true);

  const [cardsProfiles, setCardsProfiles] = React.useState(false);
  const [cardsProjetos, setCardsProjetos] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [n_cards, setNcards] =  React.useState(10);
  const [pageCount, setPageCount] = React.useState(1);
  const [pesquisa,setPesquisa] = React.useState("");

  const [typeSearch, setTypeSearch] = React.useState(false);

  // interesses e cursos para pesquisa
  const  [selectedInteresses, setSelectedInteresses] = React.useState([]);
  const  [selectedCourses, setSelectedCourses] = React.useState([]);

  const [allInteresses, setAllInteresses] = React.useState([]);
  const [allCourses, setAllCourses] = React.useState([]);


  // funcoes para adicionar das listas de selecionados
  function addSelectedCourse(value)
  {
    const achou = selectedCourses.find(element => element.id === value.id);
    if(achou === undefined)
      setSelectedCourses(selectedCourses.concat([value]));
  }

  function addSelectedInteresse(value)
  {
    const achou = selectedInteresses.find(element => element.id === value.id);
    if(achou === undefined)
      setSelectedInteresses(selectedInteresses.concat([value]));
  }

  // funcoes para remover das listas de selecionados
  function removeSelectedCourse(value)
  {
    setSelectedCourses(selectedCourses.filter(element => element.id  !== value.id)) 
  }

  function removeSelectedInteresse(value)
  {
    setSelectedInteresses(selectedInteresses.filter(element => element.id  !== value.id))
  }

  function fazerPesquisa(e)
  {
    if (e.key === 'Enter') 
      setPesquisa(e.target.value)
  }
  
  // mudando o número de cards por página, renderiza novamente 
  React.useEffect(() => 
  {
      async function loadCards() 
      { 
        setPageLoading(true);

        if(typeSearch === false)
        {
          let valores = await getProjetos(pesquisa,false);
          let x = chunk(valores.data,n_cards);
          setCardsProjetos(x);
          setPageCount(x.length);
        }
        else
        {        
          let dados = [selectedInteresses,selectedCourses,pesquisa];
          let aux = await getProfiles(dados,1000);
          let x = chunk(aux, n_cards);
          setCardsProfiles(x);
          setPageCount(x.length);
        }

        let res = await doGetAllInteresses();
        if (res.status === 200 && res.statusText === "OK") 
          setAllInteresses(res.data);
    
        res = await doGetAllCourses();
        if (res.status === 200 && res.statusText === "OK") 
          setAllCourses(res.data); 

        setPageLoading(false);
      }

      loadCards();

  }, [n_cards, typeSearch, pesquisa,selectedCourses,selectedInteresses])

  return (
    <>
      { !pageLoading &&
        <Grid container className={classes.grid}>

          <Typography variant="h6"> {!typeSearch ? "Projetos" : "Usuários"} </Typography>
        
          <SearchBox>
              <SearchField>
                <Box className={classes.boxIcon}> 
                  <SearchIcon />
                </Box>
                <StyledInput 
                  placeholder={!typeSearch ? "Buscar projetos..."  : "Buscar usuários..."} 
                  inputProps={{ 'aria-label': 'search' }} 
                  onKeyPress={(e) => fazerPesquisa(e)}
                />
              </SearchField>
          </SearchBox>

          <Container>
            { typeSearch && 
              <Grid container style={{marginTop: "5px"}} spacing={1}>
              
                <Grid item xs={6}>
                  <Autocomplete
                      options={allInteresses}
                      getOptionLabel={(option) => option.nome_exibicao}
                      name="interesses"
                      id="interesses"
                      size="small"
                      freeSolo
                      onChange={(e, value) => addSelectedInteresse(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Filtrar Interesses"
                          placeholder="Interesses"
                          autoComplete="off"
                        />
                      )}
                    />
                </Grid>

                <Grid item xs={6}>
                  <Autocomplete
                      options={allCourses}
                      getOptionLabel={(option) => option.nome_exibicao}
                      name="cursos"
                      id="cursos"
                      size="small"
                      freeSolo
                      onChange={(e, value) => addSelectedCourse(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Filtrar Cursos"
                          placeholder="Cursos"
                          value=""
                          fullWidth
                        />
                      )}
                    />
                </Grid>

                <Grid item xs={6}>
                  {  selectedInteresses.length > 0 &&
                      selectedInteresses.map((interesse, index) => (
                        <Chip
                          variant="outlined"
                          label={interesse.nome_exibicao}
                          sx={{ mr: 1, mb: 1 }}
                          key={index}
                          onDelete={() => removeSelectedInteresse(interesse)}
                        />
                      ))
                  }
                </Grid>

                <Grid item xs={6}>
                  { selectedCourses &&
                    selectedCourses.map((curso, index) => (
                      <Chip
                        variant="outlined"
                        label={curso.nome_exibicao}
                        sx={{ mr: 1, mb: 1 }}
                        key={index}
                        onDelete={() => removeSelectedCourse(curso)}
                      />
                    ))
                    }
                </Grid>
              
              </Grid>
            }
          </Container>

          <Grid style={{width: "100%", display: "flex", justifyContent: "center"}} p={1}>
            <Stack direction="row" spacing={1} className={matches ? classes.stackMobile : classes.stack}>         
              <TextField
                id="select-n-cards" 
                value={n_cards} 
                label="Cards" 
                onChange={(event) => setNcards(event.target.value)}
                sx={{width: "fit-content"}}
                variant="standard"
                select
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </TextField>

              <TextField 
                id="select-type-search" 
                value={typeSearch} 
                label="Tipo de pesquisa" 
                onChange={(event) => setTypeSearch(event.target.value)}
                sx={{width: "100px"}}
                variant="standard"
                select
              >
                <MenuItem value={false}>Projetos</MenuItem>
                <MenuItem value={true}>Usuários</MenuItem>
              </TextField>
            </Stack>
          </Grid>

          {!typeSearch && <Cards valores={cardsProjetos[page-1]} cardsType="projetos"/>}
          {typeSearch && <Cards valores={cardsProfiles[page-1]} cardsType="usuarios"/>}

          <Container className={classes.pagination}>
            <Pagination 
              count={pageCount} 
              defaultPage={1}
              page={page} 
              onChange={(e, v) => {setPage(v)}}
              shape="rounded" 
              variant="outlined" 
              color="primary" 
              size="small" 
              showFirstButton 
              showLastButton
            />
          </Container>

        </Grid>
      }

      { pageLoading && <LoadingBox/>}
    </>
  );
};

export default Home;