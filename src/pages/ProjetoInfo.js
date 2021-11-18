import {
  Container,
  Box,
  Typography,
  CardHeader,
  CardContent,
  Card,
  Grid,
  CardMedia,
  CardActions,
  Button,
  Chip,
} from "@mui/material";
import React, { useState } from "react";

const ProjetoInfo = () => {
  const [tenhoInteresse, setTenhoInteresse] = useState(false);
  const [projeto, setProjeto] = useState({
    id: 4,
    title: "Projeto Teste",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id neque aliquam vestibulum morbi. Enim ut tellus elementum sagittis vitae et leo duis ut. Malesuada fames ac turpis egestas integer eget. Augue neque gravida in fermentum et. Elementum nibh tellus molestie nunc non blandit massa enim. Cum sociis natoque penatibus et magnis dis. At urna condimentum mattis pellentesque id. Luctus venenatis lectus magna fringilla urna porttitor rhoncus dolor. Convallis aenean et tortor at risus viverra adipiscing at in.",
    image: "https://source.unsplash.com/random",
    areas: [
      "Machine Learning",
      "Data Science",
      "Resistência dos Materiais",
      "Cálculo",
    ],
    cursos: [
      "Engenharia de Computação",
      "Ciência da Computação",
      "Matemática",
      "Física",
    ],
  });
  const defaultUrl =
    "https://blog.handtalk.me/wp-content/uploads/2018/11/capa-blog-2.png";
  const handleInteresse = () => {
    // Faz a requisição para adicionar para os projetos do perfil
    setTenhoInteresse(!tenhoInteresse);
  };

  return (
    <Container
      maxWidh="lg"
      sx={{
        mb: 5,
        color: "text.secondary",
      }}
    >
      <Box
        sx={{
          color: "text.secondary",
        }}
      >
        <Card sx={{ mt: 2 }}>
          <Box
            sx={{
              width: "100%",
              bgcolor: "#dedede",
            }}
          >
            <CardMedia
              component="img"
              image={projeto.image}
              height="300"
              sx={{ margin: "auto", width: "100%" }}
            />
          </Box>
          <CardContent>
            <Grid
              container
              spacing={2}
              sx={{
                p: 3,
              }}
            >
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ color: "text.secondary" }}>
                  {projeto.title}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  mt: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: "text.secondary", fontWeight: "bold" }}
                >
                  Descrição:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body"
                  align="justify"
                  sx={{ color: "text.secondary" }}
                >
                  {projeto.description}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  mt: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "text.secondary" }}
                >
                  Cursos Envolvidos:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex" }}>
                  {projeto.cursos.map((curso) => (
                    <>
                      <Chip variant="outlined" label={curso} sx={{ mr: 1 }} />
                    </>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}
                >
                  Áreas Envolvidas:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex" }}>
                  {projeto.areas.map((area) => (
                    <>
                      <Chip variant="outlined" label={area} sx={{ mr: 1 }} />
                    </>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              color={!tenhoInteresse ? "primary" : "error"}
              onClick={() => handleInteresse()}
              sx={{ mr: 3, mb: 2 }}
              size="small"
            >
              {tenhoInteresse ? "REMOVER INTERESSE" : "TENHO INTERESSE"}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};

export default ProjetoInfo;
