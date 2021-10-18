import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Grid,
  CardHeader,
  CardContent,
  Card,
  CardActions,
  CardMedia,
  Box,
  Button,
  Tabs,
  Tab,
  Avatar,
  Fab,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    marginTop: "40px",
  },
  textField: {
    marginBottom: "24px",
  },
  title: {
    marginTop: "32px",
  },
  media: {
    height: 0,
    paddingTop: "56.25%",
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
  },
}));

const Perfil = () => {
  const [valueTab, setTabValue] = useState("perfil");
  const info = {
    id: 1,
    title: "Título 1",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
    image: "https://source.unsplash.com/random",
  };

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <>
      <Box>
        <Card style={{ minHeight: "100vh" }}>
          <TabContext
            value={valueTab}
            color="primary"
            style={{ marginTop: "24px" }}
          >
            <Box
              sx={{
                borderBottom: 1,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TabList
                indicatorColor="primary"
                onChange={handleChange}
                style={{ marginTop: "24px", marginBottom: "16px" }}
              >
                <Tab label="Meus Dados" value="perfil" />
                <Tab label="Meus Projetos" value="projetos" />
                <Tab label="Tenho Interesse" value="interesses" />
              </TabList>
            </Box>
            <TabPanel value="perfil">
              <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid item xs={12} sm={4} sx={{ marginTop: 4 }}>
                  <Card sx={{ marginTop: 4 }}>
                    <CardHeader
                      title={
                        <Typography variant="h6" align="center">
                          LeBron James
                        </Typography>
                      }
                    />

                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <img
                          src="./lebronJames.png"
                          style={{ width: "100px", height: "100px" }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={8}>
                  <Card>
                    <CardHeader
                      title={<Typography variant="h6">Perfil</Typography>}
                    />
                    <CardContent>
                      <Grid container style={{ width: "100%" }} spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            className={classes.textField}
                            type="email"
                            label="Email"
                            variant="outlined"
                            placeholder="Email"
                            defaultValue="email@email.com"
                            fullWidth
                            disabled
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            className={classes.textField}
                            type="input"
                            label="Name"
                            variant="outlined"
                            placeholder="Name"
                            defaultValue="LeBron James"
                            fullWidth
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            className={classes.textField}
                            type="input"
                            label="Sobrenome"
                            variant="outlined"
                            placeholder="Sobrenome"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            className={classes.textField}
                            type="input"
                            label="Curso"
                            variant="outlined"
                            placeholder="Engenharia de Computação"
                            fullWidth
                          />
                        </Grid>
                        <CardHeader
                          title={
                            <Typography variant="h6">
                              Áreas de Interesse
                            </Typography>
                          }
                        />
                        <Grid
                          item
                          xs={12}
                          style={{ border: "1px solid black" }}
                        >
                          <Typography variant="subtitle1">
                            Aqui vão as TAGS!
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        marginRight: "24px",
                        marginBottom: "16px",
                      }}
                    >
                      <Button variant="contained" color="primary">
                        Salvar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="projetos">
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <CardMedia className={classes.media} image={info.image} />
                      <CardContent>
                        <Typography variant="subtitle1">
                          {info.title}
                        </Typography>
                        <p>{info.description}</p>
                      </CardContent>
                      <CardActions>
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "end",
                            mr: 2,
                          }}
                        >
                          <Button color="primary">Editar</Button>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <CardMedia className={classes.media} image={info.image} />
                      <CardContent>
                        <Typography variant="subtitle1">
                          {info.title}
                        </Typography>
                        <p>{info.description}</p>
                      </CardContent>
                      <CardActions>
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "end",
                            mr: 2,
                          }}
                        >
                          <Button color="primary">Editar</Button>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <CardMedia className={classes.media} image={info.image} />
                      <CardContent>
                        <Typography variant="subtitle1">
                          {info.title}
                        </Typography>
                        <p>{info.description}</p>
                      </CardContent>
                      <CardActions>
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "end",
                            mr: 2,
                          }}
                        >
                          <Button color="primary" disabled>
                            Editar
                          </Button>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
                {/* <Fab
                  color="primary"
                  size="large"
                  style={{ position: "absolute", bottom: 16, right: 16 }}
                  href="/createproject"
                >
                  <AddIcon />
                </Fab> */}
              </Box>
            </TabPanel>
            <TabPanel value="interesses"></TabPanel>
          </TabContext>
        </Card>
      </Box>
    </>
  );
};

export default Perfil;
