import React, {useRef, useState, useEffect} from "react";
import { Container, Grid, Typography, useMediaQuery, IconButton } from "@mui/material";
import { Autocomplete, Box, TextField, MenuItem, Stack, InputBase } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { doGetAllCourses as doGetAllCoursesPF } from "../services/api_perfil";
import { doGetAllInteresses as doGetAllInteressesPF } from "../services/api_perfil";
import { doGetAllInteresses as doGetAllInteressesPJ } from "../services/api_projetos";
import { doGetAllCourses as doGetAllCoursesPJ } from "../services/api_projetos";

import { getProfiles, doGetDataUser } from "../services/api_perfil";
import { getMeusProjetos, getProjetos } from "../services/api_projetos";

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SearchIcon from "@mui/icons-material/Search";

import CardGroup from "../components/customCards/CardGroup";
import AlertDialog from "../components/dialogs/AlertDialog";
import LoadingBox from "../components/LoadingBox";

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
  const [pesquisa, setPesquisa] = useState("");

  const [n_cards, setNcards] =  useState(5);
  const [typeSearch, setTypeSearch] = useState(false);

  // interesses e cursos para pesquisa
  const  [selectedInteresses, setSelectedInteresses] = useState([]);
  const  [selectedCourses, setSelectedCourses] = useState([]);

  // projetos do usuario
  const [meusProjetos, setMeusProjetos] = useState([]);
  const [selectedProj, setSelectedProj] = useState(null);

  const [guidProjeto, setGuidProjeto] = useState(false);
  const [guidUsuario, setGuidUsuario] = useState(false);

  const [allInteresses, setAllInteresses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  // mudando o número de cards por página, renderiza novamente 
  useEffect(() => 
  {
      async function loadSelects() 
      { 
        setPageLoading(true);
        let proms = [];

        if(typeSearch)
        {                 
          proms.push(doGetAllInteressesPF());
          proms.push(doGetAllCoursesPF());
          proms.push(getMeusProjetos());
        }
        else
        {
          proms.push(doGetAllInteressesPJ());
          proms.push(doGetAllCoursesPJ());
        }

        await Promise.all(proms).then(data => 
          {
            if (!mountedRef.current)
              return
            if (data[0].status === 200 && data[0].statusText === "OK") 
              setAllInteresses(data[0].data);
            if (data[1].status === 200 && data[1].statusText === "OK") 
              setAllCourses(data[1].data); 
            if (typeSearch && data[2].status === 200) 
              setMeusProjetos(data[2].data);
            
            setPageLoading(false);
          }
        )
      }

      loadSelects();
  }, [typeSearch])

  useEffect(() => 
  {
      async function loadCards() 
      { 
        setPageLoading(true);
        let dados = [];
        dados.push(selectedInteresses);
        dados.push(selectedCourses);
        dados.push(pesquisa);

        let proms = [];

        if(!typeSearch)
        {
          setGuidProjeto(false);
          proms.push(getProjetos(dados,false));
          proms.push(doGetDataUser());
        }
        else
        {        
          proms.push(getProfiles(dados,n_cards));
        }

        await Promise.all(proms).then(data => 
          {
            if (!mountedRef.current)
              return

            if (!typeSearch)
            {
              if (data[0].status === 200) 
                setCardsProjetos(data[0].data);
              if (data[1].status === 200) 
                setGuidUsuario(data[1].data.guid_usuario);
            }
            else
              setCardsProfiles(data[0]);

            setPageLoading(false);
          }
        )
      }

      loadCards();

  }, [n_cards, pesquisa, selectedCourses, selectedInteresses, typeSearch]);

  // cleanup
  useEffect(() => {
    return () => { 
      mountedRef.current = false
    }
  }, [])

  async function changePage(v)
  {
    setPageLoading(true);
    let dados = [];

    if(v === null && cardsProfiles.current_cursor !== null)
      dados = [selectedInteresses,selectedCourses,pesquisa];
    else
      dados = [selectedInteresses,selectedCourses,pesquisa,v];

    await getProfiles(dados,n_cards).then(res => 
      {
        setCardsProfiles(res);
        setPageLoading(false);
      }
    );
  }

  function changeSelectedProjeto(v)
  {
    setSelectedProj(v);

    if(v)
      setGuidProjeto(v.guid);
    else
      setGuidProjeto(false);
  }

  const SearchAutoComplete = (props) => {
    const name_id = props.NameId;
    const options = props.Options;
    const event = props.Event;
    const label = props.Label;
    const value = props.Value;
    const isProj = props.isProj;

    return (
      <>
        <Autocomplete
            options={options}
            getOptionLabel={(o) => (isProj ? o.titulo : o.nome_exibicao)}
            value={value}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            name={name_id}
            id={name_id}
            size="small"
            multiple={!isProj}
            freeSolo

            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={label}
              />
            )}

            onChange={(e,v) => event(v)}
          />  
      </>
    )
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
                  onKeyPress={(e) => {if (e.key === 'Enter') setPesquisa(e.target.value)}}
                />
              </div>
          </div>

          <Container>
              <Grid container style={{marginTop: "5px"}} spacing={1} rowGap={1}>
                { typeSearch &&
                  <Grid item xs={12}>
                    <SearchAutoComplete 
                      NameId="projeto" 
                      Options={meusProjetos} 
                      Event={changeSelectedProjeto} 
                      Label="Escolha um projeto" 
                      Value={selectedProj}
                      isProj={true}
                    />
                  </Grid>
                }

                <Grid item xs={12} md={6}>
                 <SearchAutoComplete 
                    NameId="interesses" 
                    Options={allInteresses} 
                    Event={setSelectedInteresses} 
                    Label="Filtrar Interesses" 
                    Value={selectedInteresses}
                    isProj={false}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <SearchAutoComplete 
                    NameId="cursos" 
                    Options={allCourses} 
                    Event={setSelectedCourses} 
                    Label="Filtrar Cursos" 
                    Value={selectedCourses}
                    isProj={false}
                  />
                </Grid>
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
                <IconButton 
                  aria-label="prev" 
                  disabled={!cardsProfiles.previous_cursor && !cardsProfiles.current_cursor} 
                  onClick={() => changePage(cardsProfiles.previous_cursor)}
                >
                  <NavigateBeforeIcon />
                </IconButton>

                <IconButton 
                  aria-label="next" 
                  disabled={!cardsProfiles.next_cursor} 
                  onClick={() => changePage(cardsProfiles.next_cursor)}
                >
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