import React from "react";
import { Card, Box, Tab } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import Interesses from "../components/tabs perfil/Interesses";
import MeusProjetos from "../components/tabs perfil/MeusProjetos";
import MeusDados from "../components/tabs perfil/MeusDados";

const Perfil = () => {
  const [valueTab, setTabValue] = React.useState("perfil");
  const handleChange = (event, newValue) => { setTabValue(newValue); };

  return (
        <Box sx={{ mb: 4 }}>
          <Card sx={{minHeight: "calc(100vh - 148px)", mt: 4 }}>
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
                      width: "100%",
                    }}
                    style={{minHeight: "calc(100vh - 264px)", display:"flex", justifyContent: "center"}}
                  >
                      <MeusDados />
                  </Box>
              </TabPanel>

              {/* ABA MEUS PROJETOS */}
              <TabPanel value="projetos">
                <Box
                  sx={{
                    width: "100%",
                  }}
                  style={{minHeight: "calc(100vh - 264px)", display:"flex", justifyContent: "center"}}
                >
                  <MeusProjetos />
                </Box>
              </TabPanel>

              {/* ABA MEUS INTERESSES */}
              <TabPanel value="interesses">
                <Box
                  sx={{
                    width: "100%",
                  }}
                  style={{minHeight: "calc(100vh - 264px)", display:"flex", justifyContent: "center"}}
                >
                  <Interesses />
                </Box>
              </TabPanel>
            </TabContext>
          </Card>
        </Box>
  );
};

export default Perfil;
