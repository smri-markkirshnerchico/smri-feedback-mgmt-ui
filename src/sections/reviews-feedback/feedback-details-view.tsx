'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import Skeleton from '@mui/material/Skeleton';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import axios from 'src/lib/axios';
import { endpoints } from 'src/api/endpoints';
import { CONFIG } from 'src/global-config';
import { fDate, fTime } from 'src/utils/format-time';

import { MainContent } from 'src/layouts/main';
import { RouterLink } from 'src/routes/components';

import { readField } from './map-feedback-assignment';
import { PERFORMANCE_CRITERIA } from './provide-feedback-constants';
import { FeedbackDetailsCriterionCard } from './feedback-details-criterion-card';
import {
  getDefaultSubmittedFeedback,
  mapStoredSubmissionToDetails,
} from './feedback-details-mock';
import { EmployeeToBeReviewedCard } from './employee-to-be-reviewed-card';

// ----------------------------------------------------------------------

type Props = {
  needsMyReviewPath: string;
  reviewsFeedbackPath: string;
};

function parseAssignmentId(searchParams: URLSearchParams) {
  const raw = searchParams.get('assignmentId') ?? '';
  return raw.split('?')[0].split('&')[0].trim();
}

function emailFromName(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '');
  return `${slug}@smretail.com`;
}

function BreadcrumbItem({
  label,
  href,
  active,
}: {
  label: string;
  href?: string;
  active?: boolean;
}) {
  if (active || !href) {
    return (
      <Typography variant="body2" sx={{ color: active ? 'text.primary' : 'text.secondary', fontWeight: active ? 600 : 400 }}>
        {label}
      </Typography>
    );
  }

  return (
    <Link
      component={RouterLink}
      href={href}
      variant="body2"
      sx={{
        color: 'text.secondary',
        textDecoration: 'none',
        '&:hover': { color: 'text.primary' },
      }}
    >
      {label}
    </Link>
  );
}

export function FeedbackDetailsView({ needsMyReviewPath, reviewsFeedbackPath }: Readonly<Props>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = parseAssignmentId(searchParams);

  const { data: assignments = [], mutate: mutateAssignments, isValidating } = useSWR<Record<string, unknown>[]>(
    endpoints.application.feedbackAssignment.root,
    async (url: string) => {
      const res = await axios.get<unknown[]>(url);
      return res.data.filter(
        (item): item is Record<string, unknown> => item != null && typeof item === 'object'
      );
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0,
    }
  );

  // Fetch fresh data on mount to ensure latest submissions
  useEffect(() => {
    mutateAssignments();
  }, [mutateAssignments, assignmentId]);

  const assignment = useMemo(
    () =>
      assignments.find(
        (a) => readField(a, 'AssignmentId', 'assignmentId') === assignmentId
      ),
    [assignments, assignmentId]
  );

  const employeeName = assignment
    ? readField(assignment, 'EmployeeToReviewName', 'employeeToReviewName') || 'Unknown'
    : 'Unknown';
  const category = assignment
    ? readField(assignment, 'Category', 'category') || 'Project Related Feedback'
    : 'Project Related Feedback';
  const year = assignment ? readField(assignment, 'Year', 'year') || '2026' : '2026';
  const lineManager =
    readField(assignment ?? {}, 'LineManagerName', 'lineManagerName') ||
    'Steven Chua';
  const dateInitiated = readField(assignment ?? {}, 'CreatedAt', 'createdAt');
  const avatarUrl = `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-1.webp`;

  const [criterionDetails, setCriterionDetails] = useState(getDefaultSubmittedFeedback);
  const [overallComments, setOverallComments] = useState('');
  const [starRemarks, setStarRemarks] = useState<any>(null);

  useEffect(() => {
    if (!assignment) return;

    // Always use API data (API uses PascalCase keys)
    const apiRatings = assignment['Ratings'] as Record<string, unknown> | undefined;
    const apiStarRemarksByCriterion = assignment['StarRemarksByCriterion'] as Record<string, any> | undefined;
    const apiOverallComments = assignment['OverallComments'] as string | undefined;
    const apiStarRemarks = assignment['StarRemarks'] as any;

    if (apiRatings && Object.keys(apiRatings).length > 0) {
      // Transform API star remarks from PascalCase to camelCase
      const transformedStarRemarks: Record<string, any> = {};
      if (apiStarRemarksByCriterion) {
        for (const [key, remarks] of Object.entries(apiStarRemarksByCriterion)) {
          transformedStarRemarks[key] = {
            situation: remarks.Situation || '',
            task: remarks.Task || '',
            action: remarks.Action || '',
            result: remarks.Result || '',
          };
        }
      }

      setCriterionDetails(
        mapStoredSubmissionToDetails(apiRatings as Record<string, any>, transformedStarRemarks)
      );

      // Transform overall star remarks if present
      let transformedOverallStarRemarks = null;
      if (apiStarRemarks) {
        transformedOverallStarRemarks = {
          situation: apiStarRemarks.Situation || '',
          task: apiStarRemarks.Task || '',
          action: apiStarRemarks.Action || '',
          result: apiStarRemarks.Result || '',
        };
      }

      setOverallComments(apiOverallComments ?? '');
      setStarRemarks(transformedOverallStarRemarks);
    } else {
      // No submitted data in API, show defaults
      setCriterionDetails(getDefaultSubmittedFeedback());
      setOverallComments('');
      setStarRemarks(null);
    }
  }, [assignment, assignmentId]);

  const criteriaById = useMemo(
    () => Object.fromEntries(PERFORMANCE_CRITERIA.map((c) => [c.id, c])),
    []
  );

  const pageTitle = `${category} (${year}) - ${employeeName}`;
  const dateTimeInitiated = dateInitiated
    ? `${fDate(dateInitiated, 'DD MMM YYYY')} ${fTime(dateInitiated, 'h:mm A')}`
    : '09 Mar 2026 5:00 PM';

  return (
    <MainContent maxWidth={false}>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{ mb: 3, gap: 2 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            fontSize: { xs: 22, md: 28 },
            lineHeight: 1.3,
            maxWidth: 900,
          }}
        >
          {pageTitle}
        </Typography>

        <Button
          variant="outlined"
          onClick={() => router.push(needsMyReviewPath)}
          sx={{
            height: 40,
            minWidth: 88,
            px: 2.5,
            fontWeight: 600,
            textTransform: 'none',
            borderColor: 'divider',
            color: 'text.primary',
            borderRadius: 1,
          }}
        >
          Back
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Stack spacing={3}>
          {isValidating ? (
            <Card
              elevation={0}
              sx={{
                minWidth: 0,
                p: 3,
                borderRadius: '16px',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: (theme) => theme.vars.customShadows.z1,
              }}
            >
              <Skeleton variant="text" height={32} width="40%" sx={{ mb: 2.5 }} />
              <Stack spacing={2}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Box key={idx} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Skeleton variant="text" height={24} width="30%" sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} width="80%" />
                  </Box>
                ))}
              </Stack>
            </Card>
          ) : (
            <Card
              elevation={0}
              sx={{
                minWidth: 0,
                p: 3,
                borderRadius: '16px',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: (theme) => theme.vars.customShadows.z1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'text.primary' }}>
                Performance Criteria
              </Typography>

              <Stack spacing={2}>
                {criterionDetails.map((detail) => {
                  const criterion = criteriaById[detail.criterionId];
                  if (!criterion) return null;

                  return (
                    <FeedbackDetailsCriterionCard
                      key={detail.criterionId}
                      criterion={criterion}
                      rating={detail.rating}
                      starRemarks={detail.starRemarks}
                      defaultExpanded={detail.defaultExpanded}
                    />
                  );
                })}
              </Stack>
            </Card>
          )}

          {!isValidating && starRemarks && (starRemarks.situation || starRemarks.task || starRemarks.action || starRemarks.result) && (
            <Card
              elevation={0}
              sx={{
                minWidth: 0,
                p: 3,
                borderRadius: '16px',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: (theme) => theme.vars.customShadows.z1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'text.primary' }}>
                STAR Method - Overall Comments
              </Typography>
              <Stack spacing={2}>
                {starRemarks.situation && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                      Situation
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {starRemarks.situation}
                    </Typography>
                  </Box>
                )}
                {starRemarks.task && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                      Task
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {starRemarks.task}
                    </Typography>
                  </Box>
                )}
                {starRemarks.action && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                      Action
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {starRemarks.action}
                    </Typography>
                  </Box>
                )}
                {starRemarks.result && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                      Result
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {starRemarks.result}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Card>
          )}

          {!isValidating && overallComments && (
            <Card
              elevation={0}
              sx={{
                minWidth: 0,
                p: 3,
                borderRadius: '16px',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: (theme) => theme.vars.customShadows.z1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'text.primary' }}>
                Overall Comments
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                  {overallComments}
                </Typography>
              </Box>
            </Card>
          )}
        </Stack>

        <Box
          sx={{
            position: { lg: 'sticky' },
            top: { lg: 'calc(var(--layout-header-desktop-height) + 24px)' },
          }}
        >
          {isValidating ? (
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                boxShadow: (theme) => theme.vars?.customShadows?.z1,
              }}
            >
              <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" height={32} width="60%" sx={{ mx: 'auto', mb: 1 }} />
              <Skeleton variant="text" height={20} width="50%" sx={{ mx: 'auto', mb: 2 }} />
              <Stack direction="row" spacing={1} justifyContent="center">
                <Skeleton variant="rounded" width={100} height={24} />
                <Skeleton variant="rounded" width={100} height={24} />
              </Stack>
            </Card>
          ) : (
            <EmployeeToBeReviewedCard
              employeeName={employeeName}
              email={emailFromName(employeeName)}
              avatarUrl={avatarUrl}
              lineManager={lineManager}
              dateTimeInitiated={dateTimeInitiated}
              category={category}
              year={year}
            />
          )}
        </Box>
      </Box>
    </MainContent>
  );
}
