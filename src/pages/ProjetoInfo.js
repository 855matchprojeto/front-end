import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";

import { Grid, Box, Typography, CardContent } from "@mui/material";
import { CardActions, Button, Chip } from "@mui/material";
import { Tabs, Tab, Divider } from "@mui/material";

import { getProjetos, getProjUserRel, putRel } from "../services/api_projetos";

import ProjectDefault from "../icons/project.svg";
import { makeStyles } from "@mui/styles";
import CardPage from "../components/customCards/CardPage";
import ImageDialog from "../components/dialogs/ImageDialog";

//--estilo--
const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
    marginTop: theme.spacing(1),
  },

  subtitle: {
    fontWeight: "bold",
    color: theme.palette.text.secondary,
  },

  descricao: {
    textAlign: "justify",
    color: theme.palette.text.secondary,
    textIndent: theme.spacing(4),
  },

  mediaContainer: {
    display: "flex",
    justifyContent: "center",
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    boxShadow:
      "0 0 3px" +
      (theme.palette.mode === "dark"
        ? theme.palette.grey[100]
        : theme.palette.common.black),
  },

  media: {
    display: "flex",
    width: "300px",
    height: "200px",
  },
}));
//---------

function ProjetoInfo() {
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

  async function updateRel() {
    let body = { fl_usuario_interesse: !btnInteresse };
    await putRel(userGuid, guid, body).then((res) => {
      if (res.status === 200) setBtnInteresse(!btnInteresse);
    });
  }

  useEffect(() => {
    async function getData() {
      setPageLoading(true);

      await Promise.all([getProjetos(pid, true), getProjUserRel(guid, true, null),]).then((data) => 
        {
          if (!mountedRef.current) 
            return;

          if (data[0].status === 200) 
          {
            let aux = data[0].data[0];

            let body = {
              titulo: aux.titulo,
              descricao: aux.descricao,
              cursos: aux.cursos,
              interesses: aux.interesses,
              url_imagem: aux.imagem_projeto !== null ? aux.imagem_projeto.url : null,
              participantes: [1, 2, 3]
            };

            setProjectInfo(body);
          }

          if (data[1].status === 200) 
          {
            let aux = data[1].data.filter((item) => item.guid_usuario === userGuid);
            if (aux.length === 1) 
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
      mountedRef.current = false;
    };
  }, []);

  const Subtitle = (props) => {
    return (
      <Typography variant="subtitle1" className={classes.subtitle}>
        {props.txt}
      </Typography>
    );
  };

  return (
    <CardPage loading={pageLoading}>
      {projectInfo && (
        <>
          <div className={classes.mediaContainer}>
            <ImageDialog
              urlImg={projectInfo.url_imagem}
              classRef={classes.media}
              cardMediaComp={Button}
              cardMediaImg={
                projectInfo.url_imagem ? projectInfo.url_imagem : ProjectDefault
              }
            />
          </div>

          <CardContent>
            <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
              <Tab label="Sobre" value="sobre" />
              <Tab label="Contato" value="contato" />
            </Tabs>

            <Divider mt="0.5" mb="1" />

            {currentTab === "sobre" && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5" className={classes.title}>
                    {projectInfo.titulo}
                  </Typography>
                </Grid>

                {projectInfo.descricao && (
                  <Grid item xs={12}>
                    <Subtitle txt="Descrição:" />

                    <Typography
                      component="div"
                      variant="body2"
                      className={classes.descricao}
                    >
                      {projectInfo.descricao}
                    </Typography>
                  </Grid>
                )}

                {projectInfo.cursos && projectInfo.cursos.length > 0 && (
                  <Grid item xs={12}>
                    <Subtitle txt="Cursos Envolvidos:" />

                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {projectInfo.cursos.map((crs, index) => (
                        <Chip
                          key={index}
                          label={crs.nome_exibicao}
                          sx={{ mr: 1, mt: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}

                {projectInfo.interesses && projectInfo.interesses.length > 0 && (
                  <Grid item xs={12}>
                    <Subtitle txt="Áreas Envolvidas:" />

                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {projectInfo.interesses.map((area, index) => (
                        <Chip
                          key={index}
                          label={area.nome_exibicao}
                          sx={{ mr: 1, mt: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}

            {currentTab === "contato" && (
              <Grid container spacing={2} sx={{ p: 3, px: 1 }}>
                <div>Teste</div>
              </Grid>
            )}
          </CardContent>

          <CardActions sx={{ display: "flex", justifyContent: "end", p: 2 }}>
            <Button
              variant="contained"
              size="small"
              color={btnInteresse ? "error" : "success"}
              onClick={() => updateRel()}
            >
              {btnInteresse ? "Remover interesse" : "Marcar interesse"}
            </Button>
          </CardActions>
        </>
      )}
    </CardPage>
  );
}

export default ProjetoInfo;
