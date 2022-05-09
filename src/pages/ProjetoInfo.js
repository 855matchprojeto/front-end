import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, CardContent, Card } from "@mui/material";
import {  Tabs, Tab, Divider } from "@mui/material";
import { Grid, CardMedia, CardActions, Button, Chip } from "@mui/material";
import { useLocation } from "react-router";
import { getProjetos } from "../services/api_projetos";
import { getProjUserRel, putRel } from "../services/api_projetos";
import LoadingBox from "../components/LoadingBox";
import ParticipanteCard from "../components/ParticipanteCard";
import ProjectDefault from "../icons/project.svg";                              
import { makeStyles } from "@mui/styles";

//--estilo--
const useStyles = makeStyles((theme) => ({  
  grid: {
    maxWidth: "800px",
    alignSelf: "center",
    marginTop: theme.spacing(2),
  },
  
  mediaContainer: {
    display: "flex", 
    justifyContent: "center",
    margin: theme.spacing(2),
    boxShadow: "0 0 3px" + (theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.common.black),
  },

  media: {
    display: "flex",
    width: "fit-content",
    height: "200px"
  },
}));
//---------

function ProjetoInfo()
{
  const mountedRef = useRef(true);
  const [currentTab, setCurrentTab] = useState("sobre");
  const [projectInfo, setProjectInfo] = useState(false);

  const classes = useStyles();

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(true);

  const location = useLocation();
  const pid = location.state?.data[0];
  const guid = location.state?.data[1];
  const userGuid = location.state?.data[2];
  const [btnInteresse, setBtnInteresse] = useState(false);

  async function updateRel() 
  {
    if(!btnInteresse)
    {
      let body = {"fl_usuario_interesse": true};
      await putRel(userGuid, guid, body);
    }
    else 
    {
      let body = {"fl_usuario_interesse": false};
      await putRel(userGuid, guid, body);
    }

    setBtnInteresse(!btnInteresse);
  }

  useEffect(() => {
    async function getData() 
    {
      setPageLoading(true);

      await getProjetos(pid, true).then(res =>
        {
          if (!mountedRef.current)
            return
          if(res.status === 200)
            setProjectInfo(res.data[0]);
        }
      )

      await getProjUserRel(guid, true, null).then(res =>
        {
          if (!mountedRef.current)
            return
          if(res.status === 200)
          {
            let aux = res.filter(item => item.guid_usuario === userGuid);
            if(aux.length === 1)
              setBtnInteresse(true);
          }
          setPageLoading(false);
        }
      );
      
    }

    getData();
  }, [guid, pid, userGuid]);

  // cleanup
  useEffect(() => {
    return () => { 
      mountedRef.current = false
    }
  }, [])

  return (
    <>
      {!pageLoading && (
        <Grid container className={classes.grid}>
          {projectInfo && (
            <Box sx={{ color: "text.secondary" }}>
              <Card sx={{ mt: 2 }}>
                <Box className={classes.mediaContainer} sx={{ p: 2 }}>
                  <CardMedia
                    component="img"
                    src={
                      projectInfo.url_imagem
                        ? projectInfo.url_imagem
                        : ProjectDefault
                    }
                    className={classes.media}
                  />
                </Box>

                <CardContent>
                  <Tabs
                    value={currentTab}
                    onChange={(e, newValue) => setCurrentTab(newValue)}
                  >
                    <Tab label="Sobre" value="sobre" />
                    <Tab label="Participantes" value="participantes" />
                  </Tabs>
                  <Divider mt="0.5" mb="1" />

                  {currentTab === "sobre" && (
                    <Grid container spacing={2} sx={{ p: 3, px: 1 }}>
                      <Grid item xs={12}>
                        <Typography variant="h6" color="textSecondary">
                          {projectInfo.titulo}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ mt: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "text.secondary", fontWeight: "bold" }}
                        >
                          Descrição:
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            textAlign: "justify",
                          }}
                        >
                          {projectInfo.descricao}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold", color: "text.secondary" }}
                        >
                          Cursos Envolvidos:
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", flexWrap: "wrap"}}>
                          {projectInfo &&
                            projectInfo.cursos.map((curso, index) => (
                              <Chip key={index} label={curso.nome_exibicao} sx={{ mr: 1, mt: 0.5}}/>
                            ))}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            color: "text.secondary",
                            mt: 2,
                          }}
                        >
                          Áreas Envolvidas:
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", flexWrap: "wrap"}}>
                          {projectInfo &&
                            projectInfo.interesses.map((area, index) => (
                                <Chip key={index} label={area.nome_exibicao} sx={{ mr: 1 , mt: 0.5}}/>
                            ))}
                        </Box>
                      </Grid>
                    </Grid>
                  )}

                  {currentTab === "participantes" && (
                    <Grid container spacing={2} sx={{ p: 3, px: 1 }}>
                      {/* projectsInfo && projects.participantes.map(participante =>
                      (
                      <Grid item key={participante.id} xs={12}>
                        <ParticipanteCard participante={participante} />
                      </Grid>
                      )) */}
                      <Grid item xs={12}>
                        <ParticipanteCard />
                      </Grid>
                      <Grid item xs={12}>
                        <ParticipanteCard />
                      </Grid>
                      <Grid item xs={12}>
                        <ParticipanteCard />
                      </Grid>
                    </Grid>
                  )}
                </CardContent>

                <CardActions
                  sx={{ display: "flex", justifyContent: "end", p: 2 }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    color={btnInteresse ? "error" : "success"}
                    onClick={() => updateRel()}
                  >
                    {btnInteresse ? "Remover interesse" : "Marcar interesse"}
                  </Button>
                </CardActions>
              </Card>
            </Box>
          )}
        </Grid>
      )}

      {pageLoading && <LoadingBox />}
    </>
  );
};

export default ProjetoInfo;
