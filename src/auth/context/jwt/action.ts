'use client';

import axios from 'src/lib/axios';

import { endpoints } from 'src/api/endpoints';

import { setAccess, setRefresh } from './utils';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export type SignInParams = {
  username: string;
  password: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signIn = async ({ username, password }: SignInParams): Promise<void> => {
  try {
    const params = { Username: username, Password: password, ModuleCode: CONFIG.moduleCode, AppCode: CONFIG.appCode };

    const res = await axios.post(endpoints.core.admin.auth.login, params);

    const { AccessToken, RefreshToken } = res.data;

    if (!AccessToken) {
      throw new Error('Access token not found in response');
    }

    if (!RefreshToken) {
      throw new Error('Refresh token not found in response');
    }

    setAccess(AccessToken);
    setRefresh(RefreshToken);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await axios.get(endpoints.core.admin.auth.logout);
  } catch (error) {
    console.error('Error during sign out:', error);
  } finally {
    setAccess(null);
    setRefresh(null);
    localStorage.removeItem('USER_ROLE');
  }
};