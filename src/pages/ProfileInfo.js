import React,{ useState, useEffect } from "react";
import {Box, Typography, CardContent, Card } from "@mui/material";
import {Grid, Chip, CardMedia } from "@mui/material";
import { useLocation } from "react-router";
import LoadingBox from "../components/LoadingBox";
import { makeStyles } from "@mui/styles";
import { getProfilesGUID } from "../services/api_perfil";
import PersonIcon from '@mui/icons-material/Person';

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
    borderRadius: "4px",
    background: theme.palette.background.default
  }
}));
//---------

const ProfileInfo = () => {
  const [profInfo, getProfileInfo] = useState([]);
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
        const info = await getProfilesGUID(guid);
        getProfileInfo(info);
        setPageLoading(false);
       }
       
       getInfos();

   }, [guid])

  return (
    <>
      { !pageLoading &&
        <Grid container className={classes.grid}>
          { profInfo &&
            <Card className={classes.card}>

              <div className={classes.mediaContainer}>
                <CardMedia
                    alt="Not Found"
                    component={(profInfo.imagem_perfil !== null) ? "img" : PersonIcon}
                    image={(profInfo.imagem_perfil !== null) ? profInfo.imagem_perfil.url : ""} 
                    className={classes.media}
                />
              </div>
        
              <CardContent className={classes.cardContent}>
                <Grid container spacing={2}>
                
                  <Grid item xs={12}>
                    <Typography variant="h5" className={classes.title}>
                      {profInfo.nome_exibicao}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" className={classes.subtitle}>
                      Bio:
                    </Typography>

                    <Typography component="div" variant="body2" className={classes.bio}>
                      {profInfo.bio}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" className={classes.subtitle}>
                      Cursos:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap"}}>
                      { 
                        profInfo.cursos.map((crs, index) => (
                          <Chip key={index} label={crs.nome_exibicao} sx={{ mr: 1, mt: 0.5}} />                            
                      ))}
                      </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" className={classes.subtitle}>
                      Interesses:
                    </Typography>

                    <Box sx={{ display: "flex", flexWrap: "wrap"}}>
                      { 
                        profInfo.interesses.map((its, index) => (
                          <Chip key={index} label={its.nome_exibicao} sx={{ mr: 1, mt: 0.5}} />
                      ))}
                      </Box>
                  </Grid>

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