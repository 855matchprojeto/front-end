import React from "react";
import { Typography, TextField, Grid, CardHeader, CardContent, Card, CardActions } from "@mui/material"; 
import { CardMedia, Button, Chip, Autocomplete } from "@mui/material";
import { makeStyles } from "@mui/styles";
import LoadingBox from "../../components/LoadingBox";

import { doHandleDelete,doHandleDeleteCourses } from "../../services/api_perfil";
import { doAdicionaInteresse } from "../../services/api_perfil";
import { doHandleChangeCourses,doHandleSave  } from "../../services/api_perfil";

import { doGetDataUser } from "../../services/api_perfil";
import { doGetAllCourses, doGetInteresses } from "../../services/api_perfil";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    display:"flex", 
    flexDirection: "column", 
    alignItems: "center"
  },

  cardContent: {
    display: "flex", 
    flexDirection: "column", 
    width: "100%"
  },

  media: {
    width: "150px", 
    height: "150px", 
    border: "1px solid black", 
    borderRadius: "100%" 
  },

  actions: {
    display: "flex",
    justifyContent: "start",
    padding: "16px",
    width: "100%",
  },
}));

const MeusDados = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();  

  const perfilImageUrl = "https://upload.wikimedia.org/wikipedia/commons/e/e4/Elliot_Grieveson.png";

  const [isLoading, setIsLoading] = React.useState(false);

  const [user, setUser] = React.useState(null);
  const [allInteresses, setAllInteresses] = React.useState([]);
  const [allCourses, setAllCourses] = React.useState([]);


  async function updateCourses(value,type)
  {
    if(type === "delete")
    {
      const res = await doHandleDeleteCourses(value);

      if (res.status === 204) 
      {
        setUser({
          ...user,
          cursos: user.cursos.filter( (curso) => curso.nome_exibicao !== value.nome_exibicao)} );
        console.log("Curso removido com sucesso!");
      }
    }
    else if(type === "insert")
    {
      if (value) 
      {
        const newCourse = user.cursos.find( (curso) => curso.nome_exibicao === value.nome_exibicao);
  
        if (!newCourse) 
        {
          try 
          {
            const res = await doHandleChangeCourses(value);
  
            if (res.status === 201) 
            {
              console.log("ADICIONADO COM SUCESSO");
              console.log(value);
              setUser({ ...user, cursos: [...user.cursos, value] });
            }
          } 
          catch (err) 
          {
            console.log(err);
          }
        }
      }
    }
  }

  async function updateAreas(e,value,type)
  {
    if(type === "delete")
    {
      const res = await doHandleDelete(value);

      if (res.status === 204) 
      {
        setUser({
          ...user,
          interesses: user.interesses.filter((interesse) => interesse.nome_exibicao !== value.nome_exibicao)
        });
        console.log("Interesse removido com sucesso!");
      }
    }
    else if(type === "insert")
    {
      const newInterest = user.interesses.find( (interesse) => interesse.nome_exibicao === value.nome_exibicao);

      console.log(value.id);

      if(!newInterest)
      {
        try 
        {        
          const res = await doAdicionaInteresse(value.id);
  
          if (res.status === 201) 
          {
            console.log("ADICIONADO COM SUCESSO");
            console.log(value);
            setUser({ ...user, interesses: [...user.interesses, value] });
          }
        } 
        catch (err) 
        {
          console.log(err);
        }
      }
    }
  }

  async function handleSave() {
    setIsLoading(true);
    const nome_exibicao = `${user.name} ${user.sobrenome}`;

    try {
      const res = await doHandleSave(nome_exibicao);

      if (res.status === 200) {
        enqueueSnackbar("Dados atualizados com sucesso!", {
          anchorOrigin: {
            horizontal: "right",
            vertical: "top",
          },
          variant: "success",
        });
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }
  
  const [componentLoading, setComponentLoading] = React.useState(true);

  React.useEffect(() => {

    async function getDataUser() 
    {
      setComponentLoading(true);
      try 
      {
        
        const res = await doGetDataUser();
  
        if (res.status === 200) 
        {
          await setUser({
            name: res.data.nome_exibicao.split(" ")[0],
            sobrenome: res.data.nome_exibicao.split(" ")[1],
            interesses: res.data.interesses,
            cursos: res.data.cursos,
            email: res.data.emails && res.data.emails.length > 0 ? res.data.emails[0].email : '',
            url_imagem: res.data.url_imagem
          });

          console.log(res);



          
        }
      } 
      catch (err) 
      {
        console.log(err);
      }
    }

    async function getInteresses() 
    {
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
    }  

    async function getAllCourses() 
    {
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
      setComponentLoading(false);
    }

    getDataUser();
    getInteresses();
    getAllCourses();
  }, []);

  return (
    <>
      { !componentLoading && user &&
        <Grid container>
              <Card className={classes.card}>
                <CardHeader title={<Typography variant="h6">Perfil</Typography>}/>

                <CardMedia
                    alt="Not Found"
                    image={("url_imagem" in user && user.url_imagem !== null) ? user.url_imagem : perfilImageUrl} 
                    className={classes.media}
                />

                <CardContent className={classes.cardContent}>
                    {/* email,nome,sobrenome */}
                    <Grid container spacing={1} sx={{mt: 1}}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="email"
                          label="Email"
                          name="email"
                          variant="outlined"
                          placeholder="Email"
                          value={user ? user.email : ""}
                          size="small"
                          fullWidth
                          disabled
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} sx={{mt: 1}}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="Nome"
                          name="name"
                          variant="outlined"
                          placeholder="Nome"
                          value={user ? user.name : ""}
                          onChange={(e) => setUser ({ ...user, [e.target.name]: e.target.value})}
                          size="small"
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          type="input"
                          label="Sobrenome"
                          name="sobrenome"
                          variant="outlined"
                          placeholder="Sobrenome"
                          value={user ? user.sobrenome : ""}
                          onChange={(e) => setUser ({ ...user, [e.target.name]: e.target.value})}
                          size="small"
                          fullWidth
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} columns={12} sx={{mt: 1}}>

                      {/* caixa de cursos */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2">Cursos</Typography>

                        <Autocomplete
                            options={allCourses}
                            getOptionLabel={(option) => option.nome_exibicao}
                            name="cursos"
                            id="cursos"
                            freeSolo
                            onChange={(e, value) => updateCourses(value,"insert")}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Cursos"
                                placeholder="Cursos"
                                value=""
                                size="small"
                              />
                            )}
                          />

                        <Grid item xs={12} sx={{ display: "flex", flexWrap: "wrap"}}>
                          { user &&
                            user.cursos.map((curso, index) => (
                              <Chip
                                label={curso.nome_exibicao}
                                key={index}
                                sx={{mt: 1, ml: 1}}
                                onDelete={() => updateCourses(curso,"delete")}
                              />
                            ))}
                        </Grid>

                      </Grid>
                      
                      {/* caixa de interesses */}
                      <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2"> Áreas de Interesse </Typography>
                          
                          <Autocomplete
                                  options={allInteresses}
                                  getOptionLabel={(option) => option.nome_exibicao}
                                  name="interesses"
                                  id="interesses"
                                  freeSolo
                                  onChange={(e, value) => updateAreas(e, value,"insert")}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Interesses"
                                      placeholder="Interesses"
                                      autoComplete="off"
                                      size="small"
                                      fullWidth
                                    />
                                  )}
                          />
                        
                          <Grid item xs={12} sx={{ display: "flex", flexWrap: "wrap" }}>
                            { user &&
                              user.interesses.map((area, index) => (
                                <Chip
                                  label={area.nome_exibicao}
                                  key={index}
                                  sx={{mt: 1, ml: 1}}
                                  onDelete={(e) => updateAreas(e,area,"delete")}
                                />
                              ))}
                          </Grid>
                      </Grid>

                    </Grid>

                </CardContent>

                <CardActions className={classes.actions}>
                  <Button variant="contained" color="primary" onClick={() => handleSave()} disabled={isLoading}>
                    Salvar
                  </Button>
                </CardActions>

              </Card>
        </Grid>
      }

      { componentLoading && <LoadingBox/>}
    </>
    
  );
};

export default MeusDados;