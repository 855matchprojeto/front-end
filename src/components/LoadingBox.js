import React from "react";
import { Container, CircularProgress} from "@mui/material";

const LoadingBox = (props) => {

    return(
        <Container style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "center",alignSelf: "center"}} maxWidth="lg">
          <CircularProgress size={150} color="secondary" />
        </Container>
    )

}

export default LoadingBox;