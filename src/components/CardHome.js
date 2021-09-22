import React from "react";
import {
  Card,
  Grid,
  CardMedia,
  Typography,
  CardContent,
  CardActions,
  Button,
  makeStyles,
} from "@material-ui/core";
// import { SettingsInputAntennaTwoTone } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: "56.25%",
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
  },
}));

const CardHome = ({ info }) => {
  //const [btnInteresse, setBtnInteresse] = useState(false);
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardMedia className={classes.media} image={info.image} />

        <CardContent>
          <Typography variant="subtitle1">{info.title}</Typography>
          <p>{info.description}</p>
        </CardContent>
        
        <CardActions className={classes.actions}>
          <Button color="primary">Tenho interesse</Button>
          <Button color="secondary">Saiba mais</Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CardHome;
