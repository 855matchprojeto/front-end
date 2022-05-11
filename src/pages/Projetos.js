import React, {useState} from "react";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { Tab, Box, Paper, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Interesses from "../components/tabsProjeto/Interesses";
import MeusProjetos from "../components/tabsProjeto/MeusProjetos";
import CriarProjeto from "../components/tabsProjeto/CriarProjeto";

//--estilo--
const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0",
  },
  
  paper: {
    backgroundColor: (theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.background.paper),
    minHeight: "calc(100vh - 148px)",
    maxWidth: "1400px",
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },

  tabBox: {
    width: "100%",
    minHeight: "calc(100vh - 264px)",
    display: "flex",
    flexDirection: "column",
    padding: "0",
  },
}));
//---------

function Projetos()
{
  const [valueTab, setTabValue] = useState("projetos");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const classes = useStyles();

  const TabBox = (props) => {
    return <Box className={classes.tabBox}>{props.children}</Box>;
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
        <Paper className={classes.paper}>
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
  );
};

export default Projetos;