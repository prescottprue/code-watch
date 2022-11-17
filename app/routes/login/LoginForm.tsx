import React from 'react'
import Button from '@mui/material/Button'
import GitHubIcon from '@mui/icons-material/GitHub';
import type { LinksFunction } from "@remix-run/node";
import stylesUrl from "~/styles/login.css";
import { Form } from "@remix-run/react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

function LoginForm() {
  return (
    <Form action="/auth/github" method="post">
      <Button
        color="secondary"
        type="submit"
        variant="contained"
        startIcon={<GitHubIcon />}>
        Sign in With Github
      </Button>
    </Form>
  )
}

export default LoginForm
