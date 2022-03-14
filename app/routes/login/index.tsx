import * as React from 'react'
import Grid from '@mui/material/Grid'
import { json, LinksFunction, LoaderFunction } from "remix";
import LoginForm from './LoginForm'
import { Panel } from './Login.styled'
import stylesUrl from "~/styles/login.css";
import { authenticator } from '~/services/auth.server';
import { getSession } from '~/services/session.server';

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/repos",
  });
  let session = await getSession(request.headers.get("cookie"));
  let error = session.get(authenticator.sessionErrorKey);
  return json({ error });
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