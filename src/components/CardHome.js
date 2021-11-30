import React from "react";
import {
  Card,
  Grid,
  CardMedia,
  Typography,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";

//--estilo--
const useStyles = makeStyles({
  media: {
    height: 0,
    paddingTop: "56.25%",
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
  },
});
//---------

const CardHome = ({ info }) => {
  //const [btnInteresse, setBtnInteresse] = useState(false);
  const classes = useStyles();
  let history = useHistory();

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardMedia className={classes.media} image={info.imagem} />

        <CardContent>
          <Typography variant="subtitle1">{info.titulo}</Typography>
          <p>{info.descricao}</p>
        </CardContent>

        <CardActions className={classes.actions}>
          <Button color="primary">Tenho interesse</Button>
          <Button
            color="secondary"
            onClick={() => history.push("/projeto", { data: info.id })}
          >
            Detalhes
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CardHome;
