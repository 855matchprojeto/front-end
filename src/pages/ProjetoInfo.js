import React,{ useState, useEffect } from "react";
import {Container, Box, Typography, CardContent, Card } from "@mui/material";
import {Grid, CardMedia, CardActions, Button, Chip, CircularProgress } from "@mui/material";
import { useLocation } from "react-router";
import { getProjetos } from "../services/api_projetos";

const ProjetoInfo = () => {
  const [tenhoInteresse, setTenhoInteresse] = useState(false);
  const [projectInfo, getProjectInfo] = useState(false);
  const [projectCursos, getProjectCursos] = useState(false);
  const [projectAreas, getProjectAreas] = useState(false);

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(true);

  const location =  useLocation();
  const pid = location.state?.data;

   useEffect(() => 
   {
      setPageLoading(true);

       async function getInfos() 
       {
         // faz uma chamada de api com o pid (project id) e seta dados basicos
         const info = await getProjetos(pid);
         getProjectInfo(info.data[0]);

         // PUXAR CURSOS
         //const cr = await getProjetos(dados);
         //getProjectCursos(cr.data[0]);

         // PUXAR AREAS
         //const ar = await getProjetos(dados);
         //getProjectAreas(ar.data[0]);
       }
       
       getInfos();

       setPageLoading(false);
   },[pid])

  const handleInteresse = () => {
    // Faz a requisição para adicionar para os projetos do perfil
    setTenhoInteresse(!tenhoInteresse);
  };

  return (
    <>
      { !pageLoading &&
        <Container maxWidth="md" sx={{mb: 5}}>
          { projectInfo &&
            <Box sx={{color: "text.secondary"}}>
              <Card sx={{ mt: 2 }}>

                <Box sx={{width: "100%",bgcolor: "#dedede"}}>
                  <CardMedia component="img" image={projectInfo.image} height="300" sx={{ margin: "auto", width: "100%", backgroundSize: "cover" }}/>
                </Box>

                <CardContent>
                  <Grid container spacing={2} sx={{p: 3}}>
                  
                    <Grid item xs={12}>
                      <Typography variant="h5" sx={{ color: "text.secondary" }}>
                        {projectInfo.titulo}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sx={{mt: 2}}>
                      <Typography variant="subtitle1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                        Descrição:
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="body" align="justify" sx={{ color: "text.secondary" }}>
                        {projectInfo.descricao}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sx={{mt: 2}}>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                        Cursos Envolvidos:
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex" }}>
                        { projectCursos &&
                          projectCursos.map((curso) => (
                          <>
                            <Chip variant="outlined" label={curso} sx={{ mr: 1 }} />
                          </>
                        ))}
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
                        Áreas Envolvidas:
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex" }}>
                        { projectAreas &&
                          projectAreas.map((area) => (
                          <>
                            <Chip variant="outlined" label={area} sx={{ mr: 1 }} />
                          </>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>

                <CardActions sx={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    variant="contained"
                    color={!tenhoInteresse ? "primary" : "error"}
                    onClick={() => handleInteresse()}
                    sx={{ mr: 3, mb: 2 }}
                    size="small"
                  >
                    {tenhoInteresse ? "REMOVER INTERESSE" : "TENHO INTERESSE"}
                  </Button>
                </CardActions>
              </Card>
            </Box>
          }
        </Container>
      }

      { pageLoading &&
        <Container style={{display: "flex", height: "calc(100vh - 84px)",alignItems: "center", justifyContent: "center"}} maxWidth="lg">
          <CircularProgress size={150} color="secondary" />
        </Container>
      }
    </>
  );
};

export default ProjetoInfo;
