import React from "react";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { Tab, Box, Container, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Interesses from "../components/tabsProjeto/Interesses";
import MeusProjetos from "../components/tabsProjeto/MeusProjetos";
import CriarProjeto from "../components/tabsProjeto/CriarProjeto";

//--estilo--
const useStyles = makeStyles({
  container: {
    padding: "0",
  },

  tabBox: {
    width: "100%",
    minHeight: "calc(100vh - 264px)",
    display: "flex",
    flexDirection: "column",
    padding: "0",
  },
});
//---------

const Projetos = () => {
  const [valueTab, setTabValue] = React.useState("projetos");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const classes = useStyles();

  const TabBox = (props) => {
    return <Box className={classes.tabBox}>{props.children}</Box>;
  };

  return (
    <>
      <Container maxWidth="xl" className={classes.container}>
        <Paper sx={{ minHeight: "calc(100vh - 148px)", mt: 1 }}>
          <TabContext value={valueTab} color="primary">
            {/* CONTROLE DE ABAS */}
            <TabList
              indicatorColor="primary"
              variant="fullWidth"
              onChange={handleChange}
            >
              <Tab label="Meus Projetos" value="projetos" />
              <Tab label="Tenho Interesse" value="interesses" />
              <Tab label="Criar Projeto" value="criarprojeto" />
            </TabList>
            {/* ABA MEUS PROJETOS */}
            <TabPanel value="projetos" sx={{ padding: "0px" }}>
              <TabBox>
                {" "}
                <MeusProjetos setTabValue={setTabValue} />{" "}
              </TabBox>
            </TabPanel>

            {/* ABA MEUS INTERESSES */}
            <TabPanel value="interesses" sx={{ padding: "0px" }}>
              <TabBox>
                {" "}
                <Interesses />{" "}
              </TabBox>
            </TabPanel>
            {/* ABA MEUS ICRIAR PROJETO*/}
            <TabPanel value="criarprojeto" sx={{ padding: "0px" }}>
              <TabBox>
                <CriarProjeto />
              </TabBox>
            </TabPanel>
          </TabContext>
        </Paper>
      </Container>
    </>
  );
};

export default Projetos;
