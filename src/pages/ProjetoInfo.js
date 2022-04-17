import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CardContent,
  Card,
  Tabs,
  Tab,
  Avatar,
  Divider,
} from "@mui/material";
import { Grid, CardMedia, CardActions, Button, Chip } from "@mui/material";
import { useLocation } from "react-router";
import { getProjetos } from "../services/api_projetos";
import { postInteresseProjeto } from "../services/api_projetos";
import { deleteInteresseProjeto } from "../services/api_projetos";
import { getProjetosInteresses } from "../services/api_projetos";
import LoadingBox from "../components/LoadingBox";
import ParticipanteCard from "../components/ParticipanteCard";

const ProjetoInfo = () => {
  const [currentTab, setCurrentTab] = useState("sobre");
  const [projectInfo, getProjectInfo] = useState(false);

  //const [projectCursos, getProjectCursos] = useState(false);
  //const [projectAreas, getProjectAreas] = useState(false);
  const defaultImageUrl =
    "https://rockcontent.com/br/wp-content/uploads/sites/2/2020/04/modelo-de-projeto.png";

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(true);

  const location = useLocation();
  const pid = location.state?.data[0];
  const guid = location.state?.data[1];
  const [btnInteresse, setBtnInteresse] = React.useState(false);

  async function updateInteresse() {
    if (btnInteresse) await deleteInteresseProjeto(guid);
    else await postInteresseProjeto(guid);

    setBtnInteresse(!btnInteresse);
  }

  useEffect(() => {
    async function getStatusInteresse() {
      setPageLoading(true);
      let aux = await getProjetosInteresses();
      aux = aux.data;

      if (aux.length === 0) {
        // usuario nao tem interesse em nenhum projeto
        setBtnInteresse(false);
      } // usuario tem interesse em algum projeto, verificar se o atual é um deles
      else {
        aux.forEach(function (item, index) {
          if (item.id === pid) setBtnInteresse(true);
        });
      }
    }

    async function getInfos() {
      // faz uma chamada de api com o pid (project id) e seta dados basicos
      const info = await getProjetos(pid, true);
      getProjectInfo(info.data[0]);

      //  // PUXAR CURSOS
      //  //const cr = await getProjetos(dados);
      //  //getProjectCursos(cr.data[0]);
      //  getProjectCursos([]);

      //  // PUXAR AREAS
      //  //const ar = await getProjetos(dados);
      //  //getProjectAreas(ar.data[0]);
      //  getProjectAreas([]);

      setPageLoading(false);
    }

    getStatusInteresse();
    getInfos();
  }, [pid]);

  return (
    <>
      {!pageLoading && (
        <Container maxWidth="md" sx={{ mb: 5 }}>
          {projectInfo && (
            <Box sx={{ color: "text.secondary" }}>
              <Card sx={{ mt: 2 }}>
                <Box sx={{ p: 2 }}>
                  <CardMedia
                    component="img"
                    src={
                      projectInfo.url_imagem
                        ? projectInfo.url_imagem
                        : defaultImageUrl
                    }
                    height="300"
                    sx={{
                      margin: "auto",
                      width: "100%",
                      backgroundSize: "cover",
                    }}
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
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold", color: "text.secondary" }}
                        >
                          Cursos Envolvidos:
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex" }}>
                          {projectInfo &&
                            projectInfo.cursos.map((curso) => (
                              <>
                                <Chip
                                  label={curso.nome_exibicao}
                                  sx={{ mr: 1 }}
                                />
                              </>
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
                        <Box sx={{ display: "flex" }}>
                          {projectInfo &&
                            projectInfo.interesses.map((area) => (
                              <>
                                <Chip
                                  label={area.nome_exibicao}
                                  sx={{ mr: 1 }}
                                />
                              </>
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
                    onClick={() => updateInteresse()}
                  >
                    {btnInteresse ? "Remover interesse" : "Marcar interesse"}
                  </Button>
                </CardActions>
              </Card>
            </Box>
          )}
        </Container>
      )}

      {pageLoading && <LoadingBox />}
    </>
  );
};

export default ProjetoInfo;
