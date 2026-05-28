'use client';

import { EMPTY_STAR_REMARKS, type FeedbackRating, type StarRemarks } from 'src/types/provide-feedback';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import axios from 'src/lib/axios';
import { endpoints } from 'src/api/endpoints';
import { CONFIG } from 'src/global-config';

import { MainContent } from 'src/layouts/main';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import { readField } from './map-feedback-assignment';
import { FeedbackDetailsView } from './feedback-details-view';
import { saveFeedbackSubmission } from './feedback-submission-storage';
import { PERFORMANCE_CRITERIA, RATING_SCALE } from './provide-feedback-constants';
import { ProvideFeedbackCriterionRow } from './provide-feedback-criterion-row';

// ----------------------------------------------------------------------

type Props = {
  needsMyReviewPath: string;
};

function emailFromName(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '');
  return `${slug}@smretail.com`;
}

export function ProvideFeedbackView({ needsMyReviewPath }: Readonly<Props>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawAssignmentId = searchParams.get('assignmentId') ?? '';
  const assignmentId = rawAssignmentId.split('?')[0].split('&')[0].trim();
  const isViewMode = searchParams.get('view') === 'true';
  const reviewsFeedbackPath = needsMyReviewPath.replace(/\/needs-my-review\/?$/, '/my-feedback');

  const { data: assignments = [], mutate: mutateAssignments } = useSWR<Record<string, unknown>[]>(
    endpoints.application.feedbackAssignment.root,
    async (url: string) => {
      const res = await axios.get<unknown[]>(url);
      return res.data.filter(
        (item): item is Record<string, unknown> => item != null && typeof item === 'object'
      );
    }
  );

  // Fetch data immediately on mount
  useEffect(() => {
    mutateAssignments();
  }, [mutateAssignments]);

  const assignment = useMemo(
    () =>
      assignments.find(
        (a) => readField(a, 'AssignmentId', 'assignmentId') === assignmentId
      ),
    [assignments, assignmentId]
  );

  const [ratings, setRatings] = useState<Record<string, FeedbackRating | null>>(() =>
    Object.fromEntries(PERFORMANCE_CRITERIA.map((c) => [c.id, null]))
  );
  const [starRemarksByCriterion, setStarRemarksByCriterion] = useState<Record<string, StarRemarks>>(
    () => Object.fromEntries(PERFORMANCE_CRITERIA.map((c) => [c.id, { ...EMPTY_STAR_REMARKS }]))
  );
  const [overallComments, setOverallComments] = useState('');
  const [starRemarks, setStarRemarks] = useState<StarRemarks>({ ...EMPTY_STAR_REMARKS });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const employeeName = assignment
    ? readField(assignment, 'EmployeeToReviewName', 'employeeToReviewName') || 'Unknown'
    : 'Unknown';
  const category = assignment
    ? readField(assignment, 'Category', 'category') || 'Project Related Feedback'
    : 'Project Related Feedback';
  const year = assignment ? readField(assignment, 'Year', 'year') || '2026' : '2026';
  const avatarUrl = `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-1.webp`;

  const allRated = PERFORMANCE_CRITERIA.every((c) => ratings[c.id] != null);
  const allRatedAsME = PERFORMANCE_CRITERIA.every((c) => ratings[c.id] === 'ME');
  const canSubmit = allRated;

  const ratingSummaryLabel = useMemo(() => {
    const selected = PERFORMANCE_CRITERIA.filter((c) => ratings[c.id]).map(
      (c) => ratings[c.id]
    );
    if (!selected.length) return 'No Ratings Yet';
    return selected.join(', ');
  }, [ratings]);

  const handleCancel = useCallback(() => {
    router.push(needsMyReviewPath);
  }, [router, needsMyReviewPath]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const feedbackPayload = {
        assignmentId,
        ratings,
        starRemarks: allRatedAsME ? starRemarks : null,
        overallComments: allRatedAsME ? null : overallComments,
      };

      console.log('Submitting feedback:', feedbackPayload);
      const response = await axios.patch(endpoints.application.feedbackAssignment.submit(assignmentId), feedbackPayload);
      console.log('Feedback submitted successfully:', response);

      saveFeedbackSubmission(assignmentId, {
        ratings: ratings as Record<string, FeedbackRating>,
        starRemarksByCriterion,
        overallComments,
        starRemarks: allRatedAsME ? starRemarks : undefined,
      });

      // Refetch assignments to update all devices
      await mutateAssignments();

      router.push(needsMyReviewPath);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setIsSubmitting(false);
    }
  }, [
    router,
    needsMyReviewPath,
    assignmentId,
    ratings,
    starRemarks,
    starRemarksByCriterion,
    overallComments,
    allRatedAsME,
    mutateAssignments,
  ]);

  if (isViewMode) {
    return (
      <FeedbackDetailsView
        needsMyReviewPath={needsMyReviewPath}
        reviewsFeedbackPath={reviewsFeedbackPath}
      />
    );
  }

  const actionButtons = (
    <Stack direction="row" spacing={2}>
      <Button
        variant="outlined"
        onClick={handleCancel}
        sx={{
          height: 48,
          px: 2.5,
          fontWeight: 700,
          textTransform: 'none',
          borderColor: 'rgba(145, 158, 171, 0.32)',
          color: 'text.primary',
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        disabled={!canSubmit || isSubmitting}
        onClick={handleSubmit}
        endIcon={<Iconify icon="solar:plain-2-bold" width={20} />}
        sx={{
          height: 48,
          px: 2.5,
          fontWeight: 700,
          textTransform: 'none',
          bgcolor: (canSubmit && !isSubmitting) ? '#102FF6' : 'rgba(145, 158, 171, 0.24)',
          color: (canSubmit && !isSubmitting) ? 'common.white' : 'rgba(145, 158, 171, 0.8)',
          '&:hover': { bgcolor: (canSubmit && !isSubmitting) ? '#0919d4' : 'rgba(145, 158, 171, 0.24)' },
        }}
      >
        Submit Feedback
      </Button>
    </Stack>
  );

  return (
    <MainContent maxWidth={false}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={(theme) => ({
          position: 'sticky',
          top: {
            xs: 'var(--layout-header-mobile-height)',
            md: 'var(--layout-header-desktop-height)',
          },
          zIndex: theme.zIndex.appBar,
          bgcolor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 1.5,
          mb: 2,
          gap: 2,
        })}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#102FF6' }}>
          Provide Feedback
        </Typography>

        {actionButtons}
      </Stack>

      <Card
        variant="outlined"
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          borderColor: 'rgba(145, 158, 171, 0.2)',
          boxShadow: 'none',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={avatarUrl} alt={employeeName} sx={{ width: 56, height: 56 }}>
            {employeeName.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {employeeName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {emailFromName(employeeName)}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Label
                variant="soft"
                color="default"
                startIcon={<Iconify icon="solar:case-minimalistic-bold" width={16} />}
                sx={{ bgcolor: 'action.hover', color: 'text.secondary' }}
              >
                {category}
              </Label>
              <Label
                variant="soft"
                color="default"
                startIcon={<Iconify icon="solar:calendar-minimalistic-bold" width={16} />}
                sx={{ bgcolor: 'action.hover', color: 'text.secondary' }}
              >
                {year}
              </Label>
            </Stack>
          </Box>
        </Stack>
      </Card>

      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        flexWrap="wrap"
        sx={{ mb: 3, gap: 1 }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em' }}
        >
          RATING SCALE:
        </Typography>
        {RATING_SCALE.map((item) => (
          <Stack
            key={item.value}
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: 10,
              bgcolor: item.bgcolor,
            }}
          >
            <Iconify icon={item.icon} width={18} sx={{ color: item.color }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: item.color }}>
              {item.label}
            </Typography>
            <Typography variant="caption" sx={{ color: item.color }}>
              — {item.fullLabel}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Performance Criteria
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {PERFORMANCE_CRITERIA.map((criterion) => (
          <ProvideFeedbackCriterionRow
            key={criterion.id}
            criterion={criterion}
            rating={ratings[criterion.id] ?? null}
            starRemarks={starRemarksByCriterion[criterion.id] ?? EMPTY_STAR_REMARKS}
            onRatingChange={(value) =>
              setRatings((prev) => ({ ...prev, [criterion.id]: value }))
            }
            onStarRemarksChange={(value) =>
              setStarRemarksByCriterion((prev) => ({ ...prev, [criterion.id]: value }))
            }
          />
        ))}
      </Stack>

      {/* <Card
        variant="outlined"
        sx={{
          px: 2.5,
          py: 1.5,
          mb: 3,
          borderRadius: 2,
          bgcolor: 'rgba(145, 158, 171, 0.08)',
          borderColor: 'rgba(145, 158, 171, 0.2)',
          boxShadow: 'none',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Rating Summary
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {ratingSummaryLabel}
          </Typography>
        </Stack>
      </Card> */}

      <Card
        variant="outlined"
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          borderColor: 'rgba(145, 158, 171, 0.2)',
          boxShadow: 'none',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {allRatedAsME ? 'STAR Method - Overall Comments' : 'Overall Comments'}
        </Typography>
        {allRatedAsME ? (
          <Stack spacing={2}>
            {[
              { key: 'situation', label: 'Situation', description: 'Set the scene and provide context for the example.' },
              { key: 'task', label: 'Task', description: 'Describe the specific challenge, responsibility, or goal you faced.' },
              { key: 'action', label: 'Action', description: 'Explain in detail the actions you took to address the situation, focusing on your individual contribution.' },
              { key: 'result', label: 'Result', description: 'Share the outcomes achieved, such as savings, efficiency gains, or lessons learned, ideally with quantifiable data.' },
            ].map((item) => (
              <Box key={item.key}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {item.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                  {item.description}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  placeholder={`Enter ${item.label.toLowerCase()}...`}
                  value={starRemarks[item.key as keyof StarRemarks] || ''}
                  onChange={(e) =>
                    setStarRemarks((prev) => ({ ...prev, [item.key]: e.target.value }))
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      bgcolor: 'background.neutral',
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        ) : (
          <TextField
            fullWidth
            multiline
            minRows={5}
            placeholder="Share your overall assessment, highlight key achievements, and suggest areas for development..."
            value={overallComments}
            onChange={(e) => setOverallComments(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                bgcolor: 'background.neutral',
              },
            }}
          />
        )}
      </Card>
    </MainContent>
  );
}
