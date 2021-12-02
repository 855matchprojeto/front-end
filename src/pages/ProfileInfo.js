import React,{ useState, useEffect } from "react";
import {Container, Box, Typography, CardContent, Card } from "@mui/material";
import {Grid, Chip, CardMedia } from "@mui/material";
import { useLocation } from "react-router";
import LoadingBox from "../components/LoadingBox";
import { getProfilesGUID } from "../services/api_perfil";

const ProfileInfo = () => {
  const [profInfo, getProfileInfo] = useState([]);
  const defaultImageUrl = "https://upload.wikimedia.org/wikipedia/commons/e/e4/Elliot_Grieveson.png";

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
        console.log(info);

        setPageLoading(false);
       }
       
       getInfos();

   }, [guid])

  return (
    <>
      { !pageLoading &&
        <Container maxWidth="md" sx={{mb: 5}}>
          { profInfo &&
                        <Box sx={{color: "text.secondary"}}>

                        <Card sx={{ mt: 2 }}>
          
                          <Box sx={{width: "100%", bgcolor: "#dedede"}}>
                            <CardMedia component="img" image={("url_imagem" in profInfo && profInfo.url_imagem !== null) ? profInfo.url_imagem : defaultImageUrl}  height="300" sx={{ margin: "auto", width: "100%", backgroundSize: "cover" }}/>
                          </Box>
          
                          <CardContent>
                            <Grid container spacing={2} sx={{p: 3}}>
                            
                              <Grid item xs={12}>
                                <Typography variant="h5" sx={{ color: "text.secondary" }}>
                                  {profInfo.nome_exibicao}
                                </Typography>
                              </Grid>
          
                              <Grid item xs={12} sx={{mt: 2}}>
                                <Typography variant="subtitle1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                  Bio:
                                </Typography>
                              </Grid>
          
                              <Grid item xs={12}>
                                <Typography variant="body" align="justify" sx={{ color: "text.secondary" }}>
                                  {profInfo.bio}
                                </Typography>
                              </Grid>

                              <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
                                  Cursos:
                                </Typography>
                              </Grid>

                              <Grid item xs={12}>
                                <Box sx={{ display: "flex" }}>
                                  { 
                                    profInfo.cursos.map((crs) => (
                                    <>
                                      <Chip variant="outlined" label={crs.nome_exibicao} sx={{ mr: 1 }} />
                                    </>
                                  ))}
                                  </Box>
                              </Grid>

                              <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
                                  Interesses:
                                </Typography>
                              </Grid>

                              <Grid item xs={12}>
                                <Box sx={{ display: "flex" }}>
                                  { 
                                    profInfo.interesses.map((its) => (
                                    <>
                                      <Chip variant="outlined" label={its.nome_exibicao} sx={{ mr: 1 }} />
                                    </>
                                  ))}
                                  </Box>
                              </Grid>
          
                            </Grid>
                          </CardContent>
          
                        </Card>
          
                        </Box>
          }
        </Container>
      }

      { pageLoading && <LoadingBox/>}
    </>
  );

};

export default ProfileInfo;