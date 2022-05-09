import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";

import { Grid, Box, Typography, CardContent } from "@mui/material";
import { Chip, Button, ListItem, ListItemText, List } from "@mui/material";

import { getProfilesGUID } from "../services/api_perfil";
import ImageDialog from "../components/dialogs/ImageDialog";

import PersonIcon from '@mui/icons-material/Person';
import { makeStyles } from "@mui/styles";
import CardPage from "../components/customCards/CardPage";

//--estilo--
const useStyles = makeStyles((theme) => ({  
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
    display:"flex",
    justifyContent: "center", 
    width: "100%", 
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

function ProfileInfo()
{
  const mountedRef = useRef(true);
  const [profile, setProfile] = useState(false);
  const classes = useStyles();
  const location =  useLocation();

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(true);
  //const uid = location.state?.data[0];
  const guid = location.state?.data[1];

   useEffect(() => 
   {
       async function getInfos() 
       {
        setPageLoading(true);

        await getProfilesGUID(guid).then(res =>
          {
            if(!mountedRef.current)
              return;
            if(res.status === 200)
            {
              let aux = res.data;
              aux["url_imagem"] = aux.imagem_perfil ? aux.imagem_perfil.url : null;
              setProfile(aux);
            }
              
          }
        )
     
        setPageLoading(false);
       }
       
       getInfos();

   }, [guid])

  // cleanup
  useEffect(() => {
    return () => { 
      mountedRef.current = false
    }
  }, [])

  return (
      <CardPage loading={pageLoading}>
        { profile &&
          <>
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

                { profile.cursos && profile.cursos.length > 0 &&
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

                { profile.interesses && profile.interesses.length > 0 &&
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

                { profile.phones && profile.phones.length > 0 &&                 
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
                
                { profile.emails && profile.emails.length > 0 &&
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
          </>
        }
      </CardPage>
  );

};

export default ProfileInfo;