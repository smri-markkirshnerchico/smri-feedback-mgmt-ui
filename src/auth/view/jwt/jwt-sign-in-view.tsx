'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import axios from 'src/lib/axios';
import { endpoints } from 'src/api/endpoints';

import { getErrorMessage } from '../../utils';
import { signIn } from '../../context/jwt';
import { detectRoleFromMenu } from '../../utils/detect-role-from-menu';
import type { UserRole } from '../../types';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  username: zod
    .string()
    .min(1, { message: 'Username is required!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
});

// ----------------------------------------------------------------------

const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  employee: paths.main.employee.dashboard,
  manager: paths.main.manager.dashboard,
  admin: paths.main.admin.dashboard,
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    bgcolor: 'common.white',
    '& fieldset': {
      borderColor: 'grey.300',
    },
  },
};

export function JwtSignInView() {
  const showPassword = useBoolean();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignInSchemaType = {
    username: '',
    password: '',
  };

  const methods = useForm<SignInSchemaType>({
    mode: 'all',
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage(null);
      localStorage.removeItem('USER_ROLE');

      await signIn({ username: data.username, password: data.password });

      const menuResponse = await axios.get(endpoints.core.admin.menu);
      const menuData = menuResponse.data;

      const detectedRole = detectRoleFromMenu(menuData);

      if (!detectedRole) {
        setErrorMessage('Unable to determine user role. Please contact support.');
        return;
      }

      localStorage.setItem('USER_ROLE', detectedRole);

      const redirectPath = ROLE_DASHBOARD_MAP[detectedRole];
      window.location.href = redirectPath;
    } catch (error) {
      console.error('Login error:', error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 2.5, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="username"
        hiddenLabel
        variant="outlined"
        placeholder="Username or Email"
        sx={inputSx}
      />

      <Box sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
        <Field.Text
          name="password"
          hiddenLabel
          variant="outlined"
          placeholder="Password"
          type={showPassword.value ? 'text' : 'password'}
          sx={inputSx}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end" size="small">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      width={20}
                      sx={{ color: 'text.disabled' }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            href="#"
            variant="body2"
            underline="hover"
            sx={{ fontWeight: 600, color: '#0047FF' }}
          >
            Forgot Password?
          </Link>
        </Box>
      </Box>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="primary"
        loading={isSubmitting}
        loadingIndicator="Logging in..."
        sx={{
          mt: 0.5,
          py: 1.5,
          fontWeight: 700,
          fontSize: '1rem',
          borderRadius: 1.5,
          textTransform: 'none',
          bgcolor: '#0047FF',
          boxShadow: 'none',
          '&:hover': { bgcolor: '#003AD4', boxShadow: 'none' },
        }}
      >
        Login
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Box
          component="img"
          alt="SM logo"
          src={`${CONFIG.assetsDir}/logo/sm-logo.png`}
          sx={{
            width: 72,
            height: 72,
            mb: 2,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />

        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0047FF', mb: 1 }}>
          Feedback Management
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 360 }}
        >
          Log in to continue with feedback management workspace
        </Typography>
      </Box>

      <Alert
        severity="info"
        icon={<Iconify icon="solar:info-circle-bold" width={22} />}
        sx={{
          mb: 3,
          py: 1.25,
          alignItems: 'center',
          borderRadius: 1.5,
          border: 'none',
          bgcolor: '#DFF3FA',
          color: 'text.primary',
          '& .MuiAlert-icon': { color: '#0047FF' },
        }}
      >
        Use your Credentials to sign in
      </Alert>

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}
