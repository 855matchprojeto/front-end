import React, { useState, useEffect } from "react";
import { Container, Card, CircularProgress, Box, Tab } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import Interesses from "../components/tabs perfil/Interesses";
import MeusProjetos from "../components/tabs perfil/MeusProjetos";
import MeusDados from "../components/tabs perfil/MeusDados";

const Perfil = () => {
  const [valueTab, setTabValue] = useState("perfil");
  const handleChange = (event, newValue) => { setTabValue(newValue);};

  /*
  const meusProjetos = [
    {
      id: 1,
      title: "Título 1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
      image: "https://source.unsplash.com/random",
    },
    {
      id: 2,
      title: "Título 2",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
      image: "https://source.unsplash.com/random",
    },
  ];  
  */

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(false);

  return (
    <>
      { !pageLoading &&
        <Box sx={{ mb: 4 }}>
          <Card sx={{ minHeight: "calc(100vh - 184px)", mt: 4 }}>
            <TabContext
              value={valueTab}
              color="primary"
              style={{ marginTop: "24px" }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TabList
                  indicatorColor="primary"
                  onChange={handleChange}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <Tab label="Meus Dados" value="perfil" />
                  <Tab label="Meus Projetos" value="projetos" />
                  <Tab label="Tenho Interesse" value="interesses" />
                </TabList>
              </Box>

              {/* ABA DE PERFIL */}
              <TabPanel value="perfil">
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                    }}
                  >
                      <MeusDados />
                  </Box>
              </TabPanel>

              {/* ABA MEUS PROJETOS */}
              <TabPanel value="projetos">
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <MeusProjetos />
                </Box>
              </TabPanel>

              {/* ABA MEUS INTERESSES */}
              <TabPanel value="interesses">
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <Interesses />
                </Box>
              </TabPanel>
            </TabContext>
          </Card>
        </Box>
      }

      { pageLoading &&
        <Container style={{display: "flex", height: "calc(100vh - 84px)",alignItems: "center", justifyContent: "center"}} maxWidth="lg">
          <CircularProgress size={150} color="secondary" />
        </Container>
      }
    </>
  );
};

export default Perfil;
