import React from "react";
import { Typography, TextField, Grid, CardHeader, CardContent, Card, CardActions } from "@mui/material"; 
import { CardMedia, Button, Autocomplete } from "@mui/material";
import { makeStyles } from "@mui/styles";
import LoadingBox from "../../components/LoadingBox";
import { useSnackbar } from "notistack";

import { doGetDataUser, doGetAllCourses, doGetInteresses } from "../../services/api_perfil";

import { doHandleDelete,doHandleDeleteCourses } from "../../services/api_perfil";
import { doAdicionaInteresse } from "../../services/api_perfil";
import { doHandleChangeCourses,doHandleSave  } from "../../services/api_perfil";

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

  async function handleSave() 
  {
    setIsLoading(true);
    const nome_exibicao = `${user.name} ${user.sobrenome}`;

    try 
    {
      const res = await doHandleSave(nome_exibicao);

      if (res.status === 200) 
      {
        enqueueSnackbar("Dados atualizados com sucesso!", {
          anchorOrigin: {
            horizontal: "right",
            vertical: "top",
          },
          variant: "success",
        });
      }
    } catch (err) 
    {console.log(err)}

    setIsLoading(false);
  }
  
  const [componentLoading, setComponentLoading] = React.useState(true);

  React.useEffect(() => 
  {
    async function getDataUser() 
    {
      setComponentLoading(true);
      try 
      {
        const res = await doGetDataUser();
  
        if (res.status === 200) 
        {
          setUser({
            name: res.data.nome_exibicao.split(" ")[0],
            sobrenome: res.data.nome_exibicao.split(" ")[1],
            interesses: res.data.interesses,
            cursos: res.data.cursos,
            email: res.data.emails && res.data.emails.length > 0 ? res.data.emails[0].email : '',
            url_imagem: res.data.url_imagem
          });
        }
      } 
      catch (err) 
      {console.log(err)}
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
      {console.log(err)}
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
      {console.log(err)}

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
                        <Autocomplete
                          options={allCourses}
                          getOptionLabel={(option) => option.nome_exibicao}
                          value={user.cursos}
                          name="cursos"
                          id="cursos"
                          multiple

                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Cursos"
                              placeholder="Cursos"
                              autoComplete="off"
                              size="small"
                              fullWidth
                            />
                          )}

                          onChange={(e,v) => setUser({...user, cursos: v})}
                        />
                      </Grid>
                      
                      {/* caixa de interesses */}
                      <Grid item xs={12} md={6}>
                          <Autocomplete
                            options={allInteresses}
                            getOptionLabel={(option) => option.nome_exibicao}
                            value={user.interesses}
                            name="interesses"
                            id="interesses"
                            multiple

                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Áreas de Interesse"
                                placeholder="Interesses"
                                autoComplete="off"
                                size="small"
                                fullWidth
                              />
                            )}

                            onChange={(e,v) => setUser({...user, interesses: v})}
                          />                                
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