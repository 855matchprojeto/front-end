import React,{ useState, useEffect } from "react";
import {Container, Box, Typography, CardContent, Card } from "@mui/material";
import {Grid, CardMedia, CardActions, Button, Chip } from "@mui/material";
import { useLocation } from "react-router";
import { getProjetos } from "../services/api_projetos";
import { postInteresseProjeto } from "../services/api_projetos";
import { deleteInteresseProjeto } from "../services/api_projetos";
import { getProjetosInteresses } from "../services/api_projetos";
import LoadingBox from "../components/LoadingBox";

const ProjetoInfo = () => {
  const [projectInfo, getProjectInfo] = useState(false);
  const [projectCursos, getProjectCursos] = useState(false);
  const [projectAreas, getProjectAreas] = useState(false);

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(true);

  const location =  useLocation();
  const pid = location.state?.data[0];
  const guid = location.state?.data[1];
  const [btnInteresse, setBtnInteresse] = React.useState(false);

  async function updateInteresse()
  {
    if(btnInteresse)
      await deleteInteresseProjeto(guid);
    else
      await postInteresseProjeto(guid);

    setBtnInteresse(!btnInteresse);
  }

   useEffect(() => 
   {
      async function getStatusInteresse() 
      {
          let aux = await getProjetosInteresses();
          aux = aux.data;
          
          if (aux.length === 0) // usuario nao tem interesse em nenhum projeto
          {
            setBtnInteresse(false);
          }
          else  // usuario tem interesse em algum projeto, verificar se o atual é um deles
          {
            aux.forEach(function (item, index) {
              if (item.id === pid)
                setBtnInteresse(true);
            });
          }
      }

       async function getInfos() 
       {
        setPageLoading(true);
         // faz uma chamada de api com o pid (project id) e seta dados basicos
         const info = await getProjetos(pid);
         getProjectInfo(info.data[0]);

         // PUXAR CURSOS
         //const cr = await getProjetos(dados);
         //getProjectCursos(cr.data[0]);
         getProjectCursos([]);

         // PUXAR AREAS
         //const ar = await getProjetos(dados);
         //getProjectAreas(ar.data[0]);
         getProjectAreas([]);

         setPageLoading(false);
       }
       
       getStatusInteresse();
       getInfos();

   },[pid])

  return (
    <>
      { !pageLoading &&
        <Container maxWidth="md" sx={{mb: 5}}>
          { projectInfo &&
            <Box sx={{color: "text.secondary"}}>
              <Card sx={{ mt: 2 }}>

                <Box sx={{width: "100%", bgcolor: "#dedede"}}>
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
                    color="primary"
                    onClick={() => updateInteresse()}
                  >
                    {btnInteresse ? "Remover interesse" : "Marcar interesse"}
                  </Button>
                </CardActions>
              </Card>
            </Box>
          }
        </Container>
      }

      { pageLoading && <LoadingBox/>}
    </>
  );
};

export default ProjetoInfo;
