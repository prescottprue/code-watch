import * as React from 'react'
import Grid from '@mui/material/Grid'
import type { LinksFunction } from "remix";
import LoginForm from './LoginForm'
import { Panel } from './Login.styled'
import stylesUrl from "~/styles/login.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

function LoginPage() {
  return (
    <div>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '60vh' }}
      >
        <Grid item xs={3}>
          <Panel>
            <LoginForm />
          </Panel>
        </Grid>   
      </Grid> 
    </div>
  )
}

export default LoginPage