import React from "react";
import { Container, Paper, Box, Tab } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { makeStyles } from "@mui/styles";
import Interesses from "../components/tabs perfil/Interesses";
import MeusProjetos from "../components/tabs perfil/MeusProjetos";
import MeusDados from "../components/tabs perfil/MeusDados";

//--estilo--

const useStyles = makeStyles( ({
  container: {
    padding: "0"
  },

  tabBox: {
    width: "100%", 
    minHeight: "calc(100vh - 264px)", 
    display:"flex", 
    justifyContent: "center", 
    padding: "0"
  }
}));
//---------

const Perfil = () => {
  const [valueTab, setTabValue] = React.useState("perfil");
  const handleChange = (event, newValue) => { setTabValue(newValue); };
  const classes = useStyles();

  const TabBox = (props) => {
    return(
      <Box className={classes.tabBox}>
        {props.children}
      </Box>
    );
  }

  return (
      <Container maxWidth="lg" className={classes.container}>
          <Paper sx={{minHeight: "calc(100vh - 148px)", mt: 4 }}>
            <TabContext value={valueTab} color="primary">

              {/* CONTROLE DE ABAS */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >

                <TabList  indicatorColor="primary" 
                          variant="scrollable" 
                          scrollButtons="auto"
                          onChange={handleChange}
                >
                  <Tab label="Meus Dados" value="perfil"/>
                  <Tab label="Meus Projetos" value="projetos"/>
                  <Tab label="Tenho Interesse" value="interesses"/>
                </TabList>

              </Box>

              {/* ABA DE PERFIL */}
              <TabPanel value="perfil">
                <TabBox> <MeusDados/> </TabBox>
              </TabPanel>

              {/* ABA MEUS PROJETOS */}
              <TabPanel value="projetos">
                <TabBox> <MeusProjetos/> </TabBox>
              </TabPanel>

              {/* ABA MEUS INTERESSES */}
              <TabPanel value="interesses">
                <TabBox> <Interesses/> </TabBox>
              </TabPanel>
            </TabContext>
          </Paper>
        </Container>
  );
};

export default Perfil;
