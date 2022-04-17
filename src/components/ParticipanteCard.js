import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
const ParticipanteCard = () => {
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
            <Avatar>T</Avatar>
          </Grid>
          <Grid item xs={9} md={10}>
            <Typography variant="subtitle2">Teste Teste Card</Typography>
            <Typography variant="body2">
              Bio do usuário Lorem ipsum dolor sit amet
            </Typography>
          </Grid>
        </Grid>

        <Box></Box>
      </CardContent>
    </Card>
  );
};

export default ParticipanteCard;
