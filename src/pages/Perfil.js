import React from "react";
import { Card, Box, Tab } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import Interesses from "../components/tabs perfil/Interesses";
import MeusProjetos from "../components/tabs perfil/MeusProjetos";
import MeusDados from "../components/tabs perfil/MeusDados";

const Perfil = () => {
  const [valueTab, setTabValue] = React.useState("perfil");
  const handleChange = (event, newValue) => { setTabValue(newValue); };

  const TabBox = (props) => {
    return(
      <Box style={{width: "100%", minHeight: "calc(100vh - 264px)", display:"flex", justifyContent: "center"}}>
        {props.children}
      </Box>
    );
  }

  return (
        <Box sx={{ mb: 4 }}>
          <Card sx={{minHeight: "calc(100vh - 148px)", mt: 4 }}>
            <TabContext
              value={valueTab}
              color="primary"
              style={{ marginTop: "24px" }}
            >

              {/* CONTROLE DE ABAS */}
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
                <TabBox>
                  <MeusDados />
                </TabBox>
              </TabPanel>

              {/* ABA MEUS PROJETOS */}
              <TabPanel value="projetos">
                <TabBox>
                  <MeusProjetos />
                </TabBox>
              </TabPanel>

              {/* ABA MEUS INTERESSES */}
              <TabPanel value="interesses">
                <TabBox>
                  <Interesses />
                </TabBox>
              </TabPanel>
            </TabContext>
          </Card>
        </Box>
  );
};

export default Perfil;
