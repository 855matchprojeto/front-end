import React from "react";
import { Grid, Card } from "@mui/material";
import { makeStyles } from "@mui/styles";
import LoadingBox from "../LoadingBox";

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
    flexDirection: "column"
  },
}));
//---------

function CardPage(props)
{
  const classes = useStyles();
  const pageLoading = props.loading;

  return (
    <>
      { !pageLoading &&
        <Grid container className={classes.grid}>
            <Card className={classes.card}>
                {props.children}
            </Card>         
        </Grid>
      }

      { pageLoading && <LoadingBox/>}
    </>
  );

};

export default CardPage;