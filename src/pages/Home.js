import React, {useRef, useState, useEffect} from "react";
import { Container, Grid, Typography, useMediaQuery, IconButton } from "@mui/material";
import { Autocomplete, Box, TextField, MenuItem, Stack, InputBase } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import { getProjetos } from "../services/api_projetos";
import { getProfiles } from "../services/api_perfil";
import LoadingBox from "../components/LoadingBox";
import {doGetAllCourses,doGetAllInteresses,doGetDataUser} from "../services/api_perfil";
import { getMeusProjetos } from "../services/api_projetos";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CardGroup from "../components/customCards/CardGroup";
import AlertDialog from "../components/dialogs/AlertDialog";

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

function Home()
{
  const mountedRef = useRef(true);
  const classes = useStyles();
  const matches = useMediaQuery('(max-width: 600px)');

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(true);

  const [cardsProfiles, setCardsProfiles] = useState(false);
  const [cardsProjetos, setCardsProjetos] = useState(false);
  const [pesquisa,setPesquisa] = useState("");

  const [n_cards, setNcards] =  useState(5);
  const [typeSearch, setTypeSearch] = useState(false);

  // interesses e cursos para pesquisa
  const  [selectedInteresses, setSelectedInteresses] = useState([]);
  const  [selectedCourses, setSelectedCourses] = useState([]);

  // projetos do usuario
  const [meusProjetos, setMeusProjetos] = useState([]);

  const [guidProjeto, setGuidProjeto] = useState(false);
  const [guidUsuario, setGuidUsuario] = useState(false);

  const [allInteresses, setAllInteresses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  
  // mudando o número de cards por página, renderiza novamente 
  useEffect(() => 
  {
      async function loadCards() 
      { 
        setPageLoading(true);
        
        if(!typeSearch)
        {
          setGuidProjeto(false);

          await getProjetos(pesquisa,false).then(res =>
            {
              if (!mountedRef.current)
                return
              if(res.status === 200)
                setCardsProjetos(res.data);
            }
          );

          await doGetDataUser().then(res =>
            {
              if (!mountedRef.current)
                return
              if(res.status === 200)
                setGuidUsuario(res.data.guid_usuario);
              setPageLoading(false);
            }
          );
        }
        else
        {        
          let dados = [selectedInteresses,selectedCourses,pesquisa];
          await getProfiles(dados,n_cards).then(res =>
            {
              if (!mountedRef.current)
                return
              setCardsProfiles(res);
            }
          );

          await doGetAllInteresses().then(res =>
            {
              if (!mountedRef.current)
                return
              if (res.status === 200 && res.statusText === "OK") 
                setAllInteresses(res.data);
            }
          )
          
          await doGetAllCourses().then(res =>
            {
              if (!mountedRef.current)
                return
              if (res.status === 200 && res.statusText === "OK") 
                setAllCourses(res.data); 
            }
          )  

          await getMeusProjetos().then(res =>
            {
              if (!mountedRef.current)
                return
              if (res.status === 200) 
                setMeusProjetos(res.data);
              setPageLoading(false);
            }
          ); 
        }
      }

      loadCards();

  }, [n_cards, typeSearch, pesquisa, selectedCourses, selectedInteresses])

  // cleanup
  useEffect(() => {
    return () => { 
      mountedRef.current = false
    }
  }, [])

  function fazerPesquisa(e)
  {
    if (e.key === 'Enter') 
      setPesquisa(e.target.value)
  }

  async function changePage(v)
  {
    setPageLoading(true);
    let dados = [];

    if(v === null && cardsProfiles.current_cursor !== null)
      dados = [selectedInteresses,selectedCourses,pesquisa];
    else
      dados = [selectedInteresses,selectedCourses,pesquisa,v];

    let aux = await getProfiles(dados,n_cards);
    setCardsProfiles(aux);
    setPageLoading(false);
  }

  function changeSelectedProjeto(v)
  {
    if(v)
      setGuidProjeto(v.guid);
    else
      setGuidProjeto(false);
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
              <Grid container style={{marginTop: "5px"}} spacing={1} rowGap={1}>
                  
                { typeSearch &&
                  <Grid item xs={12}>
                    <Autocomplete
                      options={meusProjetos}
                      getOptionLabel={(o) => o.titulo}
                      isOptionEqualToValue={(o, v) => o.id === v.id}
                      name="Projeto"
                      id="projeto"
                      size="small"
                      freeSolo

                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Escolha um projeto"
                          fullWidth
                        />
                      )}

                      onChange={(e,v) => changeSelectedProjeto(v)}
                    />  
                  </Grid>
                }

                { typeSearch &&
                  <Grid item xs={12} md={6}>
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
                          variant="standard"
                          label="Filtrar Interesses"
                          
                        />
                      )}

                      onChange={(e,v) => setSelectedInteresses(v)}
                    />  
                  </Grid>
                }

                { typeSearch &&
                  <Grid item xs={12} md={6}>
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
                          variant="standard"
                          label="Filtrar Cursos"
                          fullWidth
                        />
                      )}

                      onChange={(e, v) => setSelectedCourses(v)}
                    />
                  </Grid>
                }
              </Grid>
          </Container>

          <Grid style={{width: "100%", display: "flex", justifyContent: "center", maxWidth: "1400px"}} p={1}>
            <Stack direction="row" spacing={1} className={matches ? classes.stackMobile : classes.stack}>    
              <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>   
                <AlertDialog type={typeSearch}/>
              </div>

              <TextField
                id="select-n-cards" 
                value={n_cards} 
                label="Cards" 
                onChange={(e) => setNcards(e.target.value)}
                sx={{width: "fit-content"}}
                variant="standard"
                select
                >
                  {
                    [5,10,20,50,100].map((v,i) => <MenuItem key={i} value={v}>{v}</MenuItem>)
                  }
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
          
          <CardGroup 
            guidRef={typeSearch ? guidProjeto : guidUsuario} 
            cardsType={typeSearch ? "usuarios" : "projetos"} 
            valores={typeSearch ? cardsProfiles.items : cardsProjetos}
          />

          { typeSearch &&
            <>
              <Container className={classes.pagination}>
                <IconButton aria-label="prev" disabled={!cardsProfiles.previous_cursor && !cardsProfiles.current_cursor} onClick={() => changePage(cardsProfiles.previous_cursor)}>
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