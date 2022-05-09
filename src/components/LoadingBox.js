import React from "react";
import { Container, CircularProgress} from "@mui/material";

function LoadingBox()
{
    return(
        <Container style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "center",alignSelf: "center"}} maxWidth="lg">
          <CircularProgress size={100} color="secondary" />
        </Container>
    )

}

export default LoadingBox;