import type { IRole } from 'src/types/role';
import type { IModuleAccess } from 'src/types/access';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher } from 'src/lib/axios';

import { fTextNullable } from 'src/utils/format-text';

import { endpoints } from '../endpoints';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.role.root;

let mutateURLRole: string | null;
let mutateURLRoleModuleAccess: string | null;

export function getRoles(appId: string) {
  const url = fTextNullable(appId) ? `${endpoint}?AppId=${appId}` : null;

  mutateURLRole = url;

  const { data, isLoading, error, isValidating } = useSWR<IRole[]>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      roles: data || [],
      rolesLoading: isLoading,
      rolesError: error,
      rolesValidating: isValidating,
      rolesEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function getRoleModuleAccess(appId: string, roleId?: string) {
  const params = new URLSearchParams();
  if (roleId) params.append("RoleId", roleId.toString());

  const paramString = params.toString();
  const urlParam = paramString ? `&${paramString}` : "";
  const url = fTextNullable(appId) ? `${endpoints.admin.role.moduleAccess}?AppId=${appId}${urlParam}` : null;

  mutateURLRoleModuleAccess = url;

  const { data, isLoading, error, isValidating } = useSWR<IModuleAccess[]>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      roleModuleAccess: data || [],
      roleModuleAccessLoading: isLoading,
      roleModuleAccessError: error,
      roleModuleAccessValidating: isValidating,
      roleModuleAccessEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createRole<T>(data: T) {
  const url = endpoint;

  await axios.post(url, data);
  
  mutate(mutateURLRole);
  mutate(mutateURLRoleModuleAccess);
}

export async function updateRole<T>(data: T) {
  const url = endpoint;

  await axios.put(url, data);
  
  mutate(mutateURLRole);
  mutate(mutateURLRoleModuleAccess);
}

export async function deleteRole(id: string) {
  const url = `${endpoint}?RoleId=${id}`;
  
  await axios.delete(url);

  mutate(mutateURLRole);
  mutate(mutateURLRoleModuleAccess);
}