import { Button, Container, Grid, Typography } from "@mui/material";
import { LinksFunction, Link } from "remix";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  return (
    <div>
      <Typography align="center">
        Open source dependency and coverage reporting
      </Typography>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '60vh' }}
      >
        <Grid item xs={3}>
          <Button variant="contained" component={Link} to="/login">
            Get Started
          </Button>
        </Grid>   
      </Grid> 
    </div>
  );
}
