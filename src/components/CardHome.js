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
  const classes = useStyles();
  return (
    <Grid item xs={12} md={4} lg={3}>
      <Card>
        <CardMedia className={classes.media} image={info.image} />
        <CardContent>
          <Typography variant="subtite1">{info.title}</Typography>
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
