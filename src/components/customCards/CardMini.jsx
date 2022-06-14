import {Typography, Avatar, Box } from "@mui/material";
import {Card, CardContent, Grid} from "@mui/material";

function CardMini(props)
{
  const nome = props.Nome;
  const contato = props.Contato;

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid
            item
            xs={3}
            md={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar>{nome[0]}</Avatar>
          </Grid>
          <Grid item xs={9} md={10}>
            <Typography variant="subtitle2"> {nome} </Typography>
            <Typography variant="body2">
              {contato}
            </Typography>
          </Grid>
        </Grid>

        <Box></Box>
      </CardContent>
    </Card>
  );
};

export default CardMini;
