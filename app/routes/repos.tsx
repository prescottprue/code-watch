import type { LinksFunction, LoaderFunction } from "remix";
import { Outlet, Link, useLoaderData } from "remix";
import { Repo } from "@prisma/client";
import { Card, CardHeader, Grid, IconButton, Tooltip } from '@mui/material'
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DeleteIcon from '@mui/icons-material/Delete'
import { getUser } from "~/services/session.server";
import { db } from "~/utils/db.server";

import stylesUrl from "~/styles/projects.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  repoListItems: Repo[];
};

export let loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  console.log('user', user)
  // TODO: Load github repos for linked orgs

  const data: LoaderData = {
    repoListItems: await db.repo.findMany(),
    user
  };
  console.log('data in loader', data)
  return data;
};

export default function AddRepoRoute() {
  const { repoListItems: repos } = useLoaderData<LoaderData>();

  return (
    <div className="repos-layout">
      <header className="repos-header">
        <div className="container">
          <Typography variant="h4" title="CodeWatch Repo" aria-label="CodeWatch Repo">
            Repos
          </Typography>
        </div>
      </header>
      <main>
      <Button variant="contained" component={Link} to="/repos/new">
        Add your own
      </Button>
      <div className="repos-outlet">
        <Outlet />
      </div>
      <Grid
        container
        spacing={0}
        direction="row"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '60vh' }}
      >
        {repos?.length ?
          repos.map((project, ind) => {
            const { id: projectId, createdAt, name, ...rest } = project || {}
            const showDelete = true
            const createdAtDate = new Date(createdAt)
            function deleteRepo() {
              console.log('Not yet implemented')
            }
            return (
              <Grid item xs={3} key={projectId}>
                <Card role="listitem" sx={{ minWidth: 300, minHeight: 200 }}>
                  <CardHeader
                    action={
                      showDelete ? (
                        <Tooltip title="Delete">
                          <IconButton onClick={deleteRepo}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      ) : null
                    }
                    title={
                      <Typography component={Link} to={`/repos/${projectId}`}>
                        {name}
                      </Typography>
                    }
                    subheader={`${createdAtDate.getMonth()}/${createdAtDate.getDay()}/${createdAtDate.getFullYear()}`}
                  />
                </Card>
              </Grid>   
            )
          })
        : (
          <Typography variant="h5">
            No Repos Found. Click "Add Project" above to add one
          </Typography>
        )}
      </Grid>
      </main>
    </div>
  );
}