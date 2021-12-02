import React from "react";
import Cards from "../components/Cards";
import { Container, Grid, createTheme, Typography, Pagination, FormControl,InputLabel } from "@mui/material";
import { Autocomplete, Chip, Box, TextField, MenuItem, Select, styled, alpha, InputBase } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import { chunk } from '../services/util';
import { getProjetos } from "../services/api_projetos";
import { getProfiles } from "../services/api_perfil";
import LoadingBox from "../components/LoadingBox";
import {doGetAllCourses,doGetInteresses} from "../services/api_perfil";


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
    marginTop: theme.spacing(2)
  },

  pagination: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1)
  },

  boxIcon: {
    alignItems: "center",
    justifyContent: "center",
    display:"flex", 
    width: '2rem', 
    height: '2rem',
    //border: "1px solid black",
    //borderRadius: "100%"
  }
});
//---------

const Home = () => {
  const classes = useStyles();

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
    {
      setPesquisa(e.target.value);
      //console.log(pesquisa);
    }
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

        try 
        {
          const res = await doGetInteresses();
          if (res.statusText === "OK") 
            setAllInteresses(res.data);
        
        } 
        catch (err) 
        {
          console.log(err);
        }
    
        try 
        {
          const res = await doGetAllCourses();
          if (res.status === 200 && res.statusText === "OK") 
            setAllCourses(res.data);
          
        }
        catch (err) 
        {
          console.log(err);
        }

        setPageLoading(false);
      }

      loadCards();

  }, [n_cards, typeSearch, pesquisa,selectedCourses,selectedInteresses])

  return (
    <>
      { !pageLoading &&
        <Container className={classes.grid} maxWidth="lg">

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
            <Grid container style={{marginTop: "5px"}} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            
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

          <FormControl size="small" variant="standard" style={{minWidth: "50px", marginTop: theme.spacing(2)}}>
            <InputLabel id="lbl-n-cards">Cards</InputLabel>

            <Select 
              labelId="lbl-n-cards" 
              id="select-n-cards" 
              value={n_cards} 
              label="Cards" 
              onChange={(event) => setNcards(event.target.value)}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" variant="standard" style={{marginLeft: "10px", minWidth: "100px", marginTop: theme.spacing(2)}}>
            <InputLabel id="lbl-type-search"> Tipo de pesquisa </InputLabel>

            <Select 
              labelId="lbl-type-search" 
              id="select-type-search" 
              value={typeSearch} 
              label="Tipo de pesquisa" 
              onChange={(event) => setTypeSearch(event.target.value)}
            >
              <MenuItem value={false}>Projetos</MenuItem>
              <MenuItem value={true}>Usuários</MenuItem>
            </Select>
          </FormControl>

          { !typeSearch &&
            <Cards valores={cardsProjetos[page-1]} cardsType="projetos"/>
          }

          { typeSearch &&
            <Cards valores={cardsProfiles[page-1]} cardsType="usuarios"/>
          }

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
