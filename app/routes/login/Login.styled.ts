import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

export const Panel = styled(Paper)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: '1.25rem',
  minWidth: '250px',
  minHeight: '220px'
}))

export const LoginProviderSection = styled('div')(() => ({
  marginTop: '1rem'
}))

export const OrLabel = styled('span')(() => ({
  marginTop: '1rem',
  marginBottom: '.5rem'
}))

export const SignUpSection = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '2rem'
}))