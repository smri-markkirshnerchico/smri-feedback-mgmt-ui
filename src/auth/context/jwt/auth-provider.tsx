'use client';

import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import axios from 'src/lib/axios';

import { endpoints } from 'src/api/endpoints';

import { CONFIG } from 'src/global-config';

import { AuthContext } from '../auth-context';
import { getAccess, getRefresh, isValidToken, setAccess, setRefresh, jwtDecode } from './utils';

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Readonly<Props>) {
  const { state, setState } = useSetState<AuthState>({ user: null, loading: true });

  const checkUserSession = useCallback(async () => {
    try {
      if (CONFIG.auth.skip) {
        setState({
          user: { UserId: 'dev-user', Name: 'Dev User', role: CONFIG.devRole },
          loading: false,
        });
        return;
      }

      const accessToken = getAccess()
      const refreshToken = getRefresh();

      let validAccess = false;

      if (accessToken && isValidToken(accessToken)) { 
        setAccess(accessToken);

        try {
          await axios.get(endpoints.core.admin.auth.check);
          validAccess = true;

          const decoded = jwtDecode(accessToken);

          // Add role from localStorage if available
          const role = localStorage.getItem('USER_ROLE');
          const userWithRole = { ...decoded };
          if (role) {
            userWithRole.role = role;
          }

          setState({ user: userWithRole, loading: false });
        } 
        catch (error) {
          console.error(error);
          validAccess = false;
        }
      }

      if (!validAccess && refreshToken) {
        const response = await axios.get(`${endpoints.core.admin.auth.validate}?AppCode=${encodeURIComponent(CONFIG.appCode)}&ModuleCode=${encodeURIComponent(CONFIG.moduleCode)}&RefreshToken=${encodeURIComponent(refreshToken)}`);

        const { AccessToken, RefreshToken } = response.data;

        setAccess(AccessToken);
        setRefresh(RefreshToken);

        const decoded = jwtDecode(AccessToken);

        // Add role from localStorage if available
        const role = localStorage.getItem('USER_ROLE');
        const userWithRole = { ...decoded };
        if (role) {
          userWithRole.role = role;
        }

        setState({ user: userWithRole, loading: false });
      }
      else if (!validAccess) {
        setAccess(null);
        setRefresh(null);
        setState({ user: null, loading: false });
      }
    } 
    catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}