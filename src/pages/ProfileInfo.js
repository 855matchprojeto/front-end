import React,{ useState, useEffect } from "react";
import {Box, Typography, CardContent, Card } from "@mui/material";
import {Grid, Chip, Button, ListItem, ListItemText, List } from "@mui/material";
import { useLocation } from "react-router";
import LoadingBox from "../components/LoadingBox";
import { makeStyles } from "@mui/styles";
import { getProfilesGUID } from "../services/api_perfil";
import PersonIcon from '@mui/icons-material/Person';
import ImageDialog from "../components/dialogs/ImageDialog";

//--estilo--
const useStyles = makeStyles((theme) => ({
  grid: {
    maxWidth: "800px",
    alignSelf: "center",
    marginTop: theme.spacing(2),
  },
  
  card: {
    width: "100%",
    display:"flex", 
    flexDirection: "column", 
    alignItems: "center"
  },

  cardContent: {
    display: "flex", 
    flexDirection: "column", 
    width: "100%"
  },

  title: {
    textAlign: "center",
  },

  subtitle: {
    fontWeight: "bold",
    color: theme.palette.text.secondary
  },

  bio: {
    textAlign: "justify",
    color: theme.palette.text.secondary,
    textIndent: theme.spacing(4)
  },

  mediaContainer: {
    width: "100%", 
    display:"flex", 
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient( gray 50%, rgba(0,0,0,0) 50%)",
    height: "200px",
  },

  media: {
    width: "150px", 
    height: "150px", 
    border: "1px solid black", 
    padding: "0",
  },

  mediaEmpty: {
    width: "150px", 
    height: "150px", 
    border: "1px solid black", 
    padding: "0",
    background: theme.palette.background.default
  }
}));
//---------

const ProfileInfo = () => {
  const [profile, setProfile] = useState([]);
  const classes = useStyles();

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(true);

  const location =  useLocation();
  //const uid = location.state?.data[0];
  const guid = location.state?.data[1];

   useEffect(() => 
   {
       async function getInfos() 
       {
        setPageLoading(true);
        let info = await getProfilesGUID(guid);
        info["url_imagem"] = info.imagem_perfil !== null ? info.imagem_perfil.url : null;
        setProfile(info);
        setPageLoading(false);
       }
       
       getInfos();

   }, [guid])

  return (
    <>
      { !pageLoading &&
        <Grid container className={classes.grid}>
          { profile &&
            <Card className={classes.card}>

              <div className={classes.mediaContainer}>

                <ImageDialog 
                  urlImg={profile.url_imagem} 
                  classRef={profile.url_imagem ? classes.media : classes.mediaEmpty} 
                  cardMediaComp={profile.url_imagem !== null ? Button : PersonIcon} 
                  cardMediaImg={profile.url_imagem  !== null ? profile.url_imagem : ""} 
                />
              </div>
        
              <CardContent className={classes.cardContent}>
                <Grid container spacing={2}>
                
                  <Grid item xs={12}>
                    <Typography variant="h5" className={classes.title}>
                      {profile.nome_exibicao}
                    </Typography>
                  </Grid>
                  
                  { profile.bio &&
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" className={classes.subtitle}>
                        Bio:
                      </Typography>

                      <Typography component="div" variant="body2" className={classes.bio}>
                        {profile.bio}
                      </Typography>
                    </Grid>
                  }

                  { profile.cursos.length > 0 &&
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" className={classes.subtitle}>
                        Cursos:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap"}}>
                        { 
                          profile.cursos.map((crs, index) => (
                            <Chip key={index} label={crs.nome_exibicao} sx={{ mr: 1, mt: 0.5}} />                            
                        ))}
                        </Box>
                    </Grid>
                  }

                  { profile.interesses.length > 0 &&
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" className={classes.subtitle}>
                        Interesses:
                      </Typography>

                      <Box sx={{ display: "flex", flexWrap: "wrap"}}>
                        { 
                          profile.interesses.map((its, index) => (
                            <Chip key={index} label={its.nome_exibicao} sx={{ mr: 1, mt: 0.5}} />
                        ))}
                        </Box>
                    </Grid>
                  }

                  { profile.phones.length > 0 &&                 
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" className={classes.subtitle}>
                        Números de contato:
                      </Typography>

                      <List>
                        {
                          profile.phones.map((phoneObj, index) => 
                            <ListItem key={index} disableGutters disablePadding>
                              <ListItemText>
                                <ListItemText primary={phoneObj.phone} />
                              </ListItemText>
                            </ListItem>
                          )
                        }
                      </List>
                    </Grid>
                  }
                  
                  { profile.emails.length > 0 &&
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" className={classes.subtitle}>
                        Emails de contato:
                      </Typography>

                      <List>
                        {
                          profile.emails.map((emailObj, index) => 
                            <ListItem key={index} disableGutters disablePadding>
                              <ListItemText>
                                <ListItemText primary={emailObj.email} />
                              </ListItemText>
                            </ListItem>
                          )
                        }
                      </List>
                  </Grid>
                  }
                </Grid>
              </CardContent>

            </Card>
          }
        </Grid>
      }

      { pageLoading && <LoadingBox/>}
    </>
  );

};

export default ProfileInfo;