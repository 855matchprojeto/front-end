import {
  Card,
  Grid,
  CardMedia,
  Typography,
  CardContent,
  CardActions,
  Button,
} from "@material-ui/core";

const CardHome = ({ info }) => {
  return (
    <Grid item xs={12} md={4} lg={3}>
      <Card>
        <CardMedia image={info.image} />
        <CardContent>
          <Typography variant="subtite1">{info.title}</Typography>
          <p>{info.description}</p>
        </CardContent>
        <CardActions>
          <Button color="primary">Tenho interesse</Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CardHome;
