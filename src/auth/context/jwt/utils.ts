import Cookies from 'universal-cookie';

import { paths } from 'src/routes/paths';

import axios from 'src/lib/axios';

import { CONFIG } from 'src/global-config';

import { endpoints } from 'src/api/endpoints';

import { ACCESS_TOKEN, REFRESH_TOKEN } from './constant';

// ----------------------------------------------------------------------

export function jwtDecode(token: string) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken: string) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || !('exp' in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp: number) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  const offset = 5*60*1000;
  const triggerTime = timeLeft - offset;

  setTimeout(async () => {
    try {
      const refreshToken = getRefresh();
      const response = await axios.get(`${endpoints.auth.validate}?AppCode=${encodeURIComponent(CONFIG.appCode)}&ModuleCode=${encodeURIComponent(CONFIG.moduleCode)}&RefreshToken=${encodeURIComponent(refreshToken)}`);
      
      const { AccessToken, RefreshToken } = response.data;

      setAccess(AccessToken);
      setRefresh(RefreshToken);
    } catch (error) {
      console.error('Error during token expiration:', error);
      setAccess(null);
      setRefresh(null);
      globalThis.location.href = paths.auth.jwt.signIn;
    }
  }, Math.max(triggerTime, 0));
}

// ----------------------------------------------------------------------

export function setAccess(accessToken: string | null) {
  try {
    if (accessToken) {
      sessionStorage.setItem(ACCESS_TOKEN, accessToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      const decodedToken = jwtDecode(accessToken);
      if (decodedToken && 'exp' in decodedToken)
        tokenExpired(decodedToken.exp);
      else
        throw new Error('Invalid access token!');
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN);
      delete axios.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error('Error during set access:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function setRefresh(refreshToken: string | null) {
  try {
    const cookies = new Cookies(null, { path: '/' });
    
    if (refreshToken) {
      cookies.set(REFRESH_TOKEN, refreshToken, { path: "/", domain: CONFIG.domainUrl, secure: true });
    }
    else {
      cookies.remove(REFRESH_TOKEN, { path: "/", domain: CONFIG.domainUrl });
    }
  } catch (error) {
    console.error('Error during set refresh:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function getAccess() {
  try {
    return sessionStorage.getItem(ACCESS_TOKEN);
  } catch (error) {
    console.error('Error during get access:', error);
    throw error;
  }
}

export function getRefresh() {
  try {
    const cookies = new Cookies(null, { path: '/' });
    return cookies.get(REFRESH_TOKEN);
  } catch (error) {
    console.error('Error during get refresh:', error);
    throw error;
  }
}