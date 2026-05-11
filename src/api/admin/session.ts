import type { 
  ISessionAccess,
  ISessionApplication, 
  ISessionModule,
  ISessionCompanyGroups,
  ISessionResponsibilities,
  ISessionCompanies,
  ISessionBranches,
  ISessionDivisions,
  ISessionDepartments,
  ISessionPositionLevels
} from 'src/types/session';

import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';

// ----------------------------------------------------------------------

export function getSessionAccess() {
  const url = endpoints.admin.session.access;

  const { data, isLoading, error, isValidating } = useSWR<ISessionAccess>(url, fetcher, { revalidateOnFocus: false });

  const memoizedValue = useMemo(
    () => ({
      sessionAccess: data,
      sessionAccessLoading: isLoading,
      sessionAccessError: error,
      sessionAccessValidating: isValidating,
      sessionAccessEmpty: !isLoading && !isValidating && !data
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}


export function getSessionApplications() {
  const url = endpoints.admin.session.apps;

  const { data, isLoading, error, isValidating } = useSWR<ISessionApplication[]>(url, fetcher, { revalidateOnFocus: false });

  const memoizedValue = useMemo(
    () => ({
      sessionApps: data || [],
      sessionAppsLoading: isLoading,
      sessionAppsError: error,
      sessionAppsValidating: isValidating,
      sessionAppsEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function getSessionModules(appId?: string) {
  const params = new URLSearchParams();
  if (appId) params.append("AppID", appId.toString());

  const paramString = params.toString();
  const urlParam = paramString ? `?${paramString}` : "";
  const url = `${endpoints.admin.session.modules}${urlParam}`;

  const { data, isLoading, error, isValidating } = useSWR<ISessionModule[]>(url, fetcher, { revalidateOnFocus: false });

  const memoizedValue = useMemo(
    () => ({
      sessionModules: data || [],
      sessionModulesLoading: isLoading,
      sessionModulesError: error,
      sessionModulesValidating: isValidating,
      sessionModulesEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function getSessionResponsibilities() {
  const url = endpoints.admin.session.responsibilities;

  const { data, isLoading, error, isValidating } = useSWR<ISessionResponsibilities[]>(url, fetcher, { revalidateOnFocus: false });

  const memoizedValue = useMemo(
    () => ({
      sessionResps: data || [],
      sessionRespsLoading: isLoading,
      sessionRespsError: error,
      sessionRespsValidating: isValidating,
      sessionRespsEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function getSessionCompanyGroups() {
  const url = endpoints.admin.session.companyGroups;

  const { data, isLoading, error, isValidating } = useSWR<ISessionCompanyGroups[]>(url, fetcher, { revalidateOnFocus: false });

  const memoizedValue = useMemo(
    () => ({
      sessionCoGrps: data || [],
      sessionCoGrpsLoading: isLoading,
      sessionCoGrpsError: error,
      sessionCoGrpsValidating: isValidating,
      sessionCoGrpsEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function getSessionCompanies(coGrpCode?: string) {
  const params = new URLSearchParams();
  if (coGrpCode) params.append("CoGrpCode", coGrpCode.toString());

  const paramString = params.toString();
  const urlParam = paramString ? `?${paramString}` : "";
  const url = `${endpoints.admin.session.companies}${urlParam}`;

  const { data, isLoading, error, isValidating } = useSWR<ISessionCompanies[]>(url, fetcher, { revalidateOnFocus: false });

  const memoizedValue = useMemo(
    () => ({
      sessionCompanies: data || [],
      sessionCompaniesLoading: isLoading,
      sessionCompaniesError: error,
      sessionCompaniesValidating: isValidating,
      sessionCompaniesEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function getSessionBranches(companyCode?: string) {
  const params = new URLSearchParams();
  if (companyCode) params.append("CompanyCode", companyCode);

  const fetch = !!companyCode;
  const url = fetch ? `${endpoints.admin.session.branches}?${params.toString()}` : null;

  const { data, isLoading, error, isValidating } = useSWR<ISessionBranches[]>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      sessionBranches: data || [],
      sessionBranchesLoading: isLoading,
      sessionBranchesError: error,
      sessionBranchesValidating: isValidating,
      sessionBranchesEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function getSessionDivisions(companyCode?: string, branchCode?: string) {
  const params = new URLSearchParams();
  if (companyCode) params.append("CompanyCode", companyCode);
  if (branchCode) params.append("BranchCode", branchCode);

  const fetch = !!companyCode && !!branchCode;
  const url = fetch ? `${endpoints.admin.session.divisions}?${params.toString()}` : null;

  const { data, isLoading, error, isValidating } = useSWR<ISessionDivisions[]>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      sessionDivisions: data || [],
      sessionDivisionsLoading: isLoading,
      sessionDivisionsError: error,
      sessionDivisionsValidating: isValidating,
      sessionDivisionsEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function getSessionDeparments(companyCode?: string, branchCode?: string, divisionCode?: string) {
  const params = new URLSearchParams();
  if (companyCode) params.append("CompanyCode", companyCode);
  if (branchCode) params.append("BranchCode", branchCode);
  if (divisionCode) params.append("DivisionCode", divisionCode);

  const fetch = !!companyCode && !!branchCode && !!divisionCode;
  const url = fetch ? `${endpoints.admin.session.departments}?${params.toString()}` : null;

  const { data, isLoading, error, isValidating } = useSWR<ISessionDepartments[]>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      sessionDepartments: data || [],
      sessionDepartmentsLoading: isLoading,
      sessionDepartmentsError: error,
      sessionDepartmentsValidating: isValidating,
      sessionDepartmentsEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function getSessionPositionLevels() {
  const url = endpoints.admin.session.positionLevels;

  const { data, isLoading, error, isValidating } = useSWR<ISessionPositionLevels[]>(url, fetcher, { revalidateOnFocus: false });

  const memoizedValue = useMemo(
    () => ({
      sessionPositionLevels: data || [],
      sessionPositionLevelsLoading: isLoading,
      sessionPositionLevelsError: error,
      sessionPositionLevelsValidating: isValidating,
      sessionPositionLevelsEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}