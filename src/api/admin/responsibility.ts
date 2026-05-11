import type { IResponsibility } from 'src/types/responsibility';
import type { IModuleAccess } from 'src/types/access';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher } from 'src/lib/axios';

import { fTextNullable } from 'src/utils/format-text';

import { endpoints } from '../endpoints';

// ----------------------------------------------------------------------

let mutateURLResp: string | null;
let mutateURLRespModuleAccess: string | null;

export function getResponsibilities(roleId: string) {
  const url = fTextNullable(roleId) ? `${endpoints.admin.responsibility.root}?RoleId=${roleId}` : null;

  mutateURLResp = url;

  const { data, isLoading, error, isValidating } = useSWR<IResponsibility[]>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      resp: data || [],
      respLoading: isLoading,
      respError: error,
      respValidating: isValidating,
      respEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function getResponsibilityModuleAccess(fetch: boolean, roleId: string, respId?: string) {
  const params = new URLSearchParams();
  if (respId) params.append("RespId", respId.toString());

  const paramString = params.toString();
  const urlParam = paramString ? `&${paramString}` : "";
  const url = (fetch && fTextNullable(roleId)) ? `${endpoints.admin.responsibility.moduleAccess}?RoleId=${roleId}${urlParam}` : null;

  mutateURLRespModuleAccess = url;

  const { data, isLoading, error, isValidating } = useSWR<IModuleAccess[]>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      respModuleAccess: data || [],
      respModuleAccessLoading: isLoading,
      respModuleAccessError: error,
      respModuleAccessValidating: isValidating,
      respModuleAccessEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createResponsibility<T>(data: T) {
  const url = endpoints.admin.responsibility.root;

  await axios.post(url, data);
  
  mutate(mutateURLResp);
  mutate(mutateURLRespModuleAccess);
}

export async function updateResponsibility<T>(data: T) {
  const url = endpoints.admin.responsibility.root;

  await axios.put(url, data);
  
  mutate(mutateURLResp);
  mutate(mutateURLRespModuleAccess);
}

export async function deleteResponsibility(id: string) {
  const url = `${endpoints.admin.responsibility.root}?RespId=${id}`;
  
  await axios.delete(url);

  mutate(mutateURLResp);
  mutate(mutateURLRespModuleAccess);
}

export async function createOrgAccess<T>(data: T) {
  const url = endpoints.admin.responsibility.orgAccess;

  await axios.post(url, data);
  
  mutate(mutateURLResp);
}

export async function updateOrgAccess<T>(data: T) {
  const url = endpoints.admin.responsibility.orgAccess;

  await axios.put(url, data);
  
  mutate(mutateURLResp);
}

export async function deleteOrgAccess(orgAccessId: string, moduleId: string, respId: string) {
  const url = `${endpoints.admin.responsibility.orgAccess}?OrgAccessId=${orgAccessId}&ModuleId=${moduleId}&RespId=${respId}`;
  
  await axios.delete(url);

  mutate(mutateURLResp);
}