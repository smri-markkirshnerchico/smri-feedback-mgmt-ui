'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';

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
import { loadFeedbackSubmission } from './feedback-submission-storage';
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

  const { data: assignments = [] } = useSWR<Record<string, unknown>[]>(
    endpoints.application.feedbackAssignment.root,
    async (url: string) => {
      const res = await axios.get<unknown[]>(url);
      return res.data.filter(
        (item): item is Record<string, unknown> => item != null && typeof item === 'object'
      );
    }
  );

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

  useEffect(() => {
    const stored = loadFeedbackSubmission(assignmentId);
    if (stored?.ratings && Object.keys(stored.ratings).length > 0) {
      setCriterionDetails(mapStoredSubmissionToDetails(stored.ratings, stored.starRemarksByCriterion));
    } else {
      setCriterionDetails(getDefaultSubmittedFeedback());
    }
  }, [assignmentId]);

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
            color: '#102FF6',
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
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#1A1A1A' }}>
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

        <Box
          sx={{
            position: { lg: 'sticky' },
            top: { lg: 'calc(var(--layout-header-desktop-height) + 24px)' },
          }}
        >
          <EmployeeToBeReviewedCard
            employeeName={employeeName}
            email={emailFromName(employeeName)}
            avatarUrl={avatarUrl}
            lineManager={lineManager}
            dateTimeInitiated={dateTimeInitiated}
            category={category}
            year={year}
          />
        </Box>
      </Box>
    </MainContent>
  );
}
