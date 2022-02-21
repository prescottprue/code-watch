import React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
// import { validateEmail } from 'utils/form'
import type { LinksFunction } from "remix";
import {
  useActionData,
  useSearchParams
} from "remix";
import stylesUrl from "~/styles/login.css";
import { ActionData } from './index';

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const Root = styled('form')(({ theme }) => ({
  justifyContent: 'flex-start',
  flexGrow: 1,
  height: '100%',
  width: '100%',
  margin: '.2rem'
}));

const SubmitSection = styled('div')(({ theme }) => ({
  justifyContent: 'center',
  flexGrow: 1,
  textAlign: 'center',
  padding: '1.25rem',
  minWidth: '192px',
  marginTop: '1.5rem'
}));

function LoginForm() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  return (
    <Root method="post">
      <input
        type="hidden"
        name="redirectTo"
        value={
          searchParams.get("redirectTo") ?? undefined
        }
      />
      <TextField
        type="text"
        placeholder="username"
        autoComplete="username"
        margin="normal"
        fullWidth
        helperText={actionData?.fieldErrors?.username
          ? "Username must be valid"
          : undefined
        }
        error={!!actionData?.fieldErrors?.username}
      />
      <TextField
        type="password"
        name="password"
        placeholder="password"
        autoComplete="current-password"
        margin="normal"
        fullWidth
        // error={!!errors.password}
        // helperText={errors.password && 'Password is required'}
      />
      <SubmitSection>
        <Button
          color="primary"
          type="submit"
          variant="contained">
          Login
        </Button>
      </SubmitSection>
    </Root>
  )
}

export default LoginForm

// export default function Login() {
//   const actionData = useActionData<ActionData>();
//   const [searchParams] = useSearchParams();
//   return (
//     <div className="container">
//       <div className="content" data-light="">
//         <h1>Login</h1>
//         <form
//           method="post"
//           aria-errormessage={
//             actionData?.formError
//               ? "form-error-message"
//               : undefined
//           }
//         >
//           <input
//             type="hidden"
//             name="redirectTo"
//             value={
//               searchParams.get("redirectTo") ?? undefined
//             }
//           />
//           <fieldset>
//             <legend className="sr-only">
//               Login or Register?
//             </legend>
//             <label>
//               <input
//                 type="radio"
//                 name="loginType"
//                 value="login"
//                 defaultChecked={
//                   !actionData?.fields?.loginType ||
//                   actionData?.fields?.loginType === "login"
//                 }
//               />{" "}
//               Login
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="loginType"
//                 value="register"
//                 defaultChecked={
//                   actionData?.fields?.loginType ===
//                   "register"
//                 }
//               />{" "}
//               Register
//             </label>
//           </fieldset>
//           <div>
//             <label htmlFor="username-input">Username</label>
//             <input
//               type="text"
//               id="username-input"
//               name="username"
//               defaultValue={actionData?.fields?.username}
//               aria-invalid={Boolean(
//                 actionData?.fieldErrors?.username
//               )}
//               aria-errormessage={
//                 actionData?.fieldErrors?.username
//                   ? "username-error"
//                   : undefined
//               }
//             />
//             {actionData?.fieldErrors?.username ? (
//               <p
//                 className="form-validation-error"
//                 role="alert"
//                 id="username-error"
//               >
//                 {actionData.fieldErrors.username}
//               </p>
//             ) : null}
//           </div>
//           <div>
//             <label htmlFor="password-input">Password</label>
//             <input
//               id="password-input"
//               name="password"
//               defaultValue={actionData?.fields?.password}
//               type="password"
//               aria-invalid={
//                 Boolean(
//                   actionData?.fieldErrors?.password
//                 ) || undefined
//               }
//               aria-errormessage={
//                 actionData?.fieldErrors?.password
//                   ? "password-error"
//                   : undefined
//               }
//             />
//             {actionData?.fieldErrors?.password ? (
//               <p
//                 className="form-validation-error"
//                 role="alert"
//                 id="password-error"
//               >
//                 {actionData.fieldErrors.password}
//               </p>
//             ) : null}
//           </div>
//           <div id="form-error-message">
//             {actionData?.formError ? (
//               <p
//                 className="form-validation-error"
//                 role="alert"
//               >
//                 {actionData.formError}
//               </p>
//             ) : null}
//           </div>
//           <button type="submit" className="button">
//             Submit
//           </button>
//         </form>
//       </div>
//       <div className="links">
//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/projects">Jokes</Link>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }