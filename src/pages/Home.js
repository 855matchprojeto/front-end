import React from "react";
import { Container, Grid, Typography, useMediaQuery, IconButton } from "@mui/material";
import { Autocomplete, Box, TextField, MenuItem, Stack, InputBase } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import { getProjetos } from "../services/api_projetos";
import { getProfiles } from "../services/api_perfil";
import LoadingBox from "../components/LoadingBox";
import {doGetAllCourses,doGetAllInteresses,doGetDataUser} from "../services/api_perfil";

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CardGroup from "../components/CardGroup";

//--estilo--
const useStyles = makeStyles(theme => ({
  grid: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(4)
  },

  stack: {
    width: "100%"
  },

  stackMobile: {
    width: "100%",
    maxWidth: 380
  },

  pagination: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(0.5)
  },

  searchBox : {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },

  searchField : {
    padding: theme.spacing(0, 1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: (theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[400]),
    color: "inherit",
    borderRadius: "5px",
  },

  styledInput : {
    "& .MuiInputBase-input": {
      transition: theme.transitions.create("width"),
      width: "100%",
      marginLeft: "5px",
      fontSize: theme.typography.body1.fontSize,

      [theme.breakpoints.up("sm")]: {
        width: "30ch",
        "&:focus": {
          width: "35ch",
        },
      },
    },
  },

  boxIcon: {
    alignItems: "center",
    justifyContent: "center",
    display:"flex", 
    width: '2rem', 
    height: '2rem'
  }
}));
//---------

const Home = () => {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width: 600px)');

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = React.useState(true);

  const [cardsProfiles, setCardsProfiles] = React.useState(false);
  const [cardsProjetos, setCardsProjetos] = React.useState(false);
  const [pesquisa,setPesquisa] = React.useState("");

  const [n_cards, setNcards] =  React.useState(10);
  const [typeSearch, setTypeSearch] = React.useState(false);

  // interesses e cursos para pesquisa
  const  [selectedInteresses, setSelectedInteresses] = React.useState([]);
  const  [selectedCourses, setSelectedCourses] = React.useState([]);

  const [guid, setGuid] = React.useState(false);
  const [allInteresses, setAllInteresses] = React.useState({});
  const [allCourses, setAllCourses] = React.useState({});

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

        if(!typeSearch)
        {
          let aux = await getProjetos(pesquisa,false);
          setCardsProjetos(aux.data);
        }
        else
        {        
          let dados = [selectedInteresses,selectedCourses,pesquisa];
          let aux = await getProfiles(dados,n_cards);
          setCardsProfiles(aux);
        }

        setPageLoading(false);
      }

      loadCards();

  }, [n_cards, typeSearch, pesquisa, selectedCourses, selectedInteresses])

  React.useEffect(() => 
  {
      async function loadFiltros() 
      { 
        setPageLoading(true);

        let res = await doGetAllInteresses();
        if (res.status === 200 && res.statusText === "OK") 
          setAllInteresses(res.data);
    
        res = await doGetAllCourses();
        if (res.status === 200 && res.statusText === "OK") 
          setAllCourses(res.data); 
      }

      async function getUserGuid() 
      { 
        let res = await doGetDataUser();
        setGuid(res.data.guid_usuario);
      }

      loadFiltros();
      getUserGuid();
  }, [])

  async function changePage(v)
  {
    setPageLoading(true);
    let dados = [selectedInteresses,selectedCourses,pesquisa,v];
    let aux = await getProfiles(dados,n_cards);
    setCardsProfiles(aux);
    setPageLoading(false);
  }

  return (
    <>
      { !pageLoading &&
        <Grid container className={classes.grid}>

          <Typography variant="h6"> {!typeSearch ? "Projetos" : "Usuários"} </Typography>
        
          <div className={classes.searchBox}>
              <div className={classes.searchField}>
                <Box className={classes.boxIcon}> 
                  <SearchIcon />
                </Box>
                <InputBase
                  className={classes.styledInput} 
                  placeholder={!typeSearch ? "Buscar projetos..."  : "Buscar usuários..."} 
                  inputProps={{ 'aria-label': 'search' }} 
                  onKeyPress={(e) => fazerPesquisa(e)}
                />
              </div>
          </div>

          <Container>
            { typeSearch && 
              <Grid container style={{marginTop: "5px"}} spacing={1}>
              
                <Grid item xs={6}>
                  <Autocomplete
                    options={allInteresses}
                    getOptionLabel={(option) => option.nome_exibicao}
                    value={selectedInteresses}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    name="interesses"
                    id="interesses"
                    size="small"
                    multiple
                    freeSolo

                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filtrar Interesses"
                        placeholder="Filtrar Interesses"
                        fullWidth
                      />
                    )}

                    onChange={(e,v) => setSelectedInteresses(v)}
                  />  
                </Grid>

                <Grid item xs={6}>
                  <Autocomplete
                    options={allCourses}
                    getOptionLabel={(option) => option.nome_exibicao}
                    value={selectedCourses}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    name="cursos"
                    id="cursos"
                    size="small"
                    multiple
                    freeSolo

                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filtrar Cursos"
                        placeholder="Filtrar Cursos"
                        fullWidth
                      />
                    )}

                    onChange={(e, v) => setSelectedCourses(v)}
                  />
                </Grid>
              
              </Grid>
            }
          </Container>

          <Grid style={{width: "100%", display: "flex", justifyContent: "center", maxWidth: "1400px"}} p={1}>
            <Stack direction="row" spacing={1} className={matches ? classes.stackMobile : classes.stack}>    
              <TextField
                id="select-n-cards" 
                value={n_cards} 
                label="Cards" 
                onChange={(e) => setNcards(e.target.value)}
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
                onChange={(e) => setTypeSearch(e.target.value)}
                sx={{width: "100px"}}
                variant="standard"
                select
              >
                <MenuItem value={false}>Projetos</MenuItem>
                <MenuItem value={true}>Usuários</MenuItem>
              </TextField>
            </Stack>
          </Grid>

          {!typeSearch && guid && cardsProjetos && <CardGroup valores={cardsProjetos} userGuid={guid} cardsType="projetos"/>}
          {typeSearch && guid && cardsProfiles && <CardGroup valores={cardsProfiles.items} cardsType="usuarios"/>}

          { cardsProfiles &&
            <>
              <Container className={classes.pagination}>
                <IconButton aria-label="prev" disabled={!cardsProfiles.previous_cursor} onClick={() => changePage(cardsProfiles.previous_cursor)}>
                  <NavigateBeforeIcon />
                </IconButton>

                <IconButton aria-label="next" disabled={!cardsProfiles.next_cursor} onClick={() => changePage(cardsProfiles.next_cursor)}>
                  <NavigateNextIcon />
                </IconButton>
              </Container>
            </>
          }
        </Grid>
      }

      { pageLoading && <LoadingBox/>}
    </>
  );
};

export default Home;