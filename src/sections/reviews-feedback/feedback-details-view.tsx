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
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import axios from 'src/lib/axios';
import { endpoints } from 'src/api/endpoints';
import { CONFIG } from 'src/global-config';
import { fDate, fTime } from 'src/utils/format-time';

import { MainContent } from 'src/layouts/main';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';

import type { FeedbackRating, StarRemarks } from 'src/types/provide-feedback';
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

interface FeedbackRequestDto {
  FeedbackId: string;
  RequestorName: string;
  Category: string;
  Year: string;
  Status: string;
  CreatedAt: string;
  ApprovedAt?: string;
  Providers: Array<{ UserId: string; Name: string; Position: string; ProjectName?: string; Reason: string }>;
}

type Props = {
  needsMyReviewPath: string;
  reviewsFeedbackPath: string;
};

function parseAssignmentId(searchParams: URLSearchParams) {
  const raw = searchParams.get('assignmentId') ?? '';
  return raw.split('?')[0].split('&')[0].trim();
}

/tmp/smri-feedback-mgmt-ui/src/sections/reviews-feedback/feedback-details-view.tsx
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

const emptyRemarks: StarRemarks = { situation: '', task: '', action: '', result: '' };

const MOCK_STAR_DRIVE_WIGGINS: StarRemarks = {
  situation: 'During a recent project deadline, the team faced tight timelines and increased workload due to multiple overlapping tasks.',
  task: 'The employee was responsible for ensuring timely completion of assigned deliverables while maintaining quality and coordinating with team members.',
  action: 'He proactively organized their workload, communicated effectively with the team, and offered support to colleagues when needed. He also identified potential risks early and suggested practical solutions to avoid delays.',
  result: 'Share the outcomes achieved, such as savings, efficiency gains, or lessons learned, ideally with quantifiable data.',
};

const MOCK_STAR_DRIVE: StarRemarks = {
  situation: 'During the last quarter, our team faced tight timelines and increased workload due to a major system rollout.',
  task: 'I was responsible for ensuring my tasks were completed on time while coordinating with cross-functional teams.',
  action: 'I proactively organized my workload, communicated early about potential delays, and offered support to teammates where needed.',
  result: 'Share the outcomes achieved, such as savings, efficiency gains, or lessons learned, ideally with quantifiable data.',
};

const MOCK_STAR_LEADERSHIP: StarRemarks = {
  situation: 'Our department launched a cross-functional initiative to improve customer response times.',
  task: 'I was asked to lead a small team and align stakeholders on priorities and timelines.',
  action: 'I facilitated weekly syncs, clarified roles, and removed blockers so the team could deliver on schedule.',
  result: 'Response times improved by 18% within two months, and handoffs between teams became smoother.',
};

const MOCK_STAR_INTEGRITY: StarRemarks = {
  situation: 'A vendor contract review surfaced inconsistent pricing terms before renewal.',
  task: 'I needed to ensure we applied the correct rates and documented decisions transparently.',
  action: 'I escalated the discrepancy, worked with procurement, and corrected the contract before signing.',
  result: 'The company avoided overpayment and strengthened audit readiness for future renewals.',
};

const MOCK_STAR_TEAMWORK: StarRemarks = {
  situation: 'A peak-season project required extra coverage across shifts and tighter coordination between teams.',
  task: 'I was responsible for keeping daily goals on track while supporting teammates during high-volume weeks.',
  action: 'I paired people by strengths, shared progress in stand-ups, and stepped in when handoffs were at risk.',
  result: 'We delivered on time with fewer escalations, and the team stayed aligned through the busy period.',
};

const MOCK_STAR_ENTREPRENEURSHIP: StarRemarks = {
  situation: 'Operations flagged a recurring bottleneck in the manual reporting process.',
  task: 'I was asked to propose a practical way to reduce rework without adding headcount.',
  action: 'I mapped the workflow, piloted a lightweight automation, and trained the team on the new steps.',
  result: 'Reporting cycle time dropped by 25%, freeing the team to focus on higher-value analysis.',
};

function getReviewerMockFeedback(reviewerName: string): any[] {
  const normName = (reviewerName || '').toLowerCase();
  
  if (normName.includes('wiggins') || normName.includes('chico') || normName.includes('mark')) {
    return [
      { criterionId: 'drive', rating: 'NI', starRemarks: MOCK_STAR_DRIVE_WIGGINS, defaultExpanded: true },
      { criterionId: 'leadership', rating: 'EE', starRemarks: MOCK_STAR_LEADERSHIP, defaultExpanded: false },
      { criterionId: 'integrity', rating: 'EE', starRemarks: MOCK_STAR_INTEGRITY, defaultExpanded: false },
      { criterionId: 'teamwork', rating: 'ME', starRemarks: MOCK_STAR_TEAMWORK, defaultExpanded: false },
      { criterionId: 'entrepreneurship', rating: 'NI', starRemarks: MOCK_STAR_ENTREPRENEURSHIP, defaultExpanded: false }
    ];
  }
  
  if (normName.includes('adrew') || normName.includes('andrew') || normName.includes('kyle') || normName.includes('manuyag')) {
    return [
      { criterionId: 'drive', rating: 'ME', starRemarks: MOCK_STAR_DRIVE, defaultExpanded: true },
      { criterionId: 'leadership', rating: 'ME', starRemarks: MOCK_STAR_LEADERSHIP, defaultExpanded: false },
      { criterionId: 'integrity', rating: 'ME', starRemarks: MOCK_STAR_INTEGRITY, defaultExpanded: false },
      { criterionId: 'teamwork', rating: 'EE', starRemarks: MOCK_STAR_TEAMWORK, defaultExpanded: false },
      { criterionId: 'entrepreneurship', rating: 'EE', starRemarks: MOCK_STAR_ENTREPRENEURSHIP, defaultExpanded: false }
    ];
  }
  
  if (normName.includes('joy') || normName.includes('shane') || normName.includes('marayag')) {
    return [
      { criterionId: 'drive', rating: 'EE', starRemarks: MOCK_STAR_DRIVE, defaultExpanded: true },
      { criterionId: 'leadership', rating: 'EE', starRemarks: MOCK_STAR_LEADERSHIP, defaultExpanded: false },
      { criterionId: 'integrity', rating: 'EE', starRemarks: MOCK_STAR_INTEGRITY, defaultExpanded: false },
      { criterionId: 'teamwork', rating: 'EE', starRemarks: MOCK_STAR_TEAMWORK, defaultExpanded: false },
      { criterionId: 'entrepreneurship', rating: 'EE', starRemarks: MOCK_STAR_ENTREPRENEURSHIP, defaultExpanded: false }
    ];
  }
  
  if (normName.includes('remin') || normName.includes('tan') || normName.includes('ian') || normName.includes('mojica')) {
    return [
      { criterionId: 'drive', rating: 'ME', starRemarks: MOCK_STAR_DRIVE, defaultExpanded: true },
      { criterionId: 'leadership', rating: 'ME', starRemarks: MOCK_STAR_LEADERSHIP, defaultExpanded: false },
      { criterionId: 'integrity', rating: 'ME', starRemarks: MOCK_STAR_INTEGRITY, defaultExpanded: false },
      { criterionId: 'teamwork', rating: 'ME', starRemarks: MOCK_STAR_TEAMWORK, defaultExpanded: false },
      { criterionId: 'entrepreneurship', rating: 'ME', starRemarks: MOCK_STAR_ENTREPRENEURSHIP, defaultExpanded: false }
    ];
  }
  
  if (normName.includes('aloisa') || normName.includes('ng') || normName.includes('kyla') || normName.includes('pantino')) {
    return [
      { criterionId: 'drive', rating: 'NI', starRemarks: MOCK_STAR_DRIVE, defaultExpanded: true },
      { criterionId: 'leadership', rating: 'NI', starRemarks: MOCK_STAR_LEADERSHIP, defaultExpanded: false },
      { criterionId: 'integrity', rating: 'ME', starRemarks: MOCK_STAR_INTEGRITY, defaultExpanded: false },
      { criterionId: 'teamwork', rating: 'EE', starRemarks: MOCK_STAR_TEAMWORK, defaultExpanded: false },
      { criterionId: 'entrepreneurship', rating: 'ME', starRemarks: MOCK_STAR_ENTREPRENEURSHIP, defaultExpanded: false }
    ];
  }

  return [
    { criterionId: 'drive', rating: 'ME', starRemarks: MOCK_STAR_DRIVE, defaultExpanded: true },
    { criterionId: 'leadership', rating: 'ME', starRemarks: MOCK_STAR_LEADERSHIP, defaultExpanded: false },
    { criterionId: 'integrity', rating: 'ME', starRemarks: MOCK_STAR_INTEGRITY, defaultExpanded: false },
    { criterionId: 'teamwork', rating: 'ME', starRemarks: MOCK_STAR_TEAMWORK, defaultExpanded: false },
    { criterionId: 'entrepreneurship', rating: 'ME', starRemarks: MOCK_STAR_ENTREPRENEURSHIP, defaultExpanded: false }
  ];
}

const avatarUrlForReviewer = (name: string, index: number) => {
  let avatarIndex = (index % 10) + 2;
  const normName = name.toLowerCase();
  if (normName.includes('wiggins') || normName.includes('chico') || normName.includes('mark')) avatarIndex = 12;
  else if (normName.includes('adrew') || normName.includes('andrew') || normName.includes('kyle') || normName.includes('manuyag')) avatarIndex = 3;
  else if (normName.includes('joy') || normName.includes('shane') || normName.includes('marayag')) avatarIndex = 4;
  else if (normName.includes('remin') || normName.includes('tan') || normName.includes('ian') || normName.includes('mojica')) avatarIndex = 5;
  else if (normName.includes('aloisa') || normName.includes('ng') || normName.includes('kyla') || normName.includes('pantino')) avatarIndex = 6;
  
  return `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-${avatarIndex}.webp`;
};

export function FeedbackDetailsView({ needsMyReviewPath, reviewsFeedbackPath }: Readonly<Props>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = parseAssignmentId(searchParams);
  const isMyFeedback = searchParams.get('isMyFeedback') === 'true';

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

  const { data: myFeedbackRequests = [] } = useSWR<FeedbackRequestDto[]>(
    isMyFeedback ? `${endpoints.application.feedback.root}/my-feedback` : null,
    async (url: string) => {
      const res = await axios.get<FeedbackRequestDto[]>(url);
      return res.data;
    }
  );

  const feedbackRequest = useMemo(
    () => myFeedbackRequests.find((f) => f.FeedbackId === assignmentId),
    [myFeedbackRequests, assignmentId]
  );

  // Fetch data on mount
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

  const employeeName = isMyFeedback
    ? (feedbackRequest ? feedbackRequest.RequestorName : 'Ryan Yatasa')
    : (assignment ? readField(assignment, 'EmployeeToReviewName', 'employeeToReviewName') || 'Unknown' : 'Unknown');

  const category = isMyFeedback
    ? (feedbackRequest ? feedbackRequest.Category : 'Project Related Feedback')
    : (assignment ? readField(assignment, 'Category', 'category') || 'Project Related Feedback' : 'Project Related Feedback');

  const year = isMyFeedback
    ? (feedbackRequest ? feedbackRequest.Year : '2026')
    : (assignment ? readField(assignment, 'Year', 'year') || '2026' : '2026');

  const lineManager = isMyFeedback
    ? 'Nino Stevens'
    : (readField(assignment ?? {}, 'LineManagerName', 'lineManagerName') || 'Steven Chua');

  const dateInitiated = isMyFeedback
    ? (feedbackRequest ? feedbackRequest.CreatedAt : undefined)
    : readField(assignment ?? {}, 'CreatedAt', 'createdAt');

  const avatarUrl = isMyFeedback
    ? `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-10.webp`
    : `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-1.webp`;

  const FALLBACK_PROVIDERS = useMemo(() => [
    { UserId: '1', Name: 'Mark Kirshner Maghirang Chico', Position: 'AVP' },
    { UserId: '2', Name: 'Kyle Charvin Cacnio Manuyag', Position: 'Department Manager' },
    { UserId: '3', Name: 'Shane T Marayag', Position: 'ITS Developer' },
    { UserId: '4', Name: 'Ian S Mojica', Position: 'ITS Developer' },
    { UserId: '5', Name: 'Kyla P Pantino', Position: 'Business Analyst' },
  ], []);

  const providers = useMemo(() => {
    if (isMyFeedback) {
      // Always return FALLBACK_PROVIDERS to show the custom names requested by the user
      return FALLBACK_PROVIDERS;
    }
    return [];
  }, [isMyFeedback, FALLBACK_PROVIDERS]);

  const [criterionDetails, setCriterionDetails] = useState(getDefaultSubmittedFeedback);
  const [overallComments, setOverallComments] = useState('');
  const [starRemarks, setStarRemarks] = useState<any>(null);
  const [selectedReviewer, setSelectedReviewer] = useState<string>('');

  useEffect(() => {
    if (isMyFeedback && providers.length) {
      setSelectedReviewer(providers[0].Name);
    }
  }, [isMyFeedback, providers]);

  useEffect(() => {
    if (isMyFeedback) {
      if (selectedReviewer) {
        const storageKey = `smri-feedback-submission-by-reviewer:${employeeName}:${selectedReviewer}`;
        if (typeof window !== 'undefined') {
          const storedRaw = sessionStorage.getItem(storageKey);
          if (storedRaw) {
            try {
              const stored = JSON.parse(storedRaw);
              if (stored?.ratings && Object.keys(stored.ratings).length > 0) {
                setCriterionDetails(mapStoredSubmissionToDetails(stored.ratings, stored.starRemarksByCriterion));
                setOverallComments(stored.overallComments || '');
                setStarRemarks(stored.starRemarks || null);
                return;
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
        
        // Fallback to high-fidelity mock reviewer data
        const mockFeedback = getReviewerMockFeedback(selectedReviewer);
        setCriterionDetails(mockFeedback);
        
        const normName = selectedReviewer.toLowerCase();
        if (normName.includes('wiggins') || normName.includes('chico') || normName.includes('mark')) {
          setStarRemarks({
            situation: 'During a recent project deadline, the team faced tight timelines and increased workload due to multiple overlapping tasks.',
            task: 'The employee was responsible for ensuring timely completion of assigned deliverables while maintaining quality and coordinating with team members.',
            action: 'He proactively organized their workload, communicated effectively with the team, and offered support to colleagues when needed. He also identified potential risks early and suggested practical solutions to avoid delays.',
            result: 'Share the outcomes achieved, such as savings, efficiency gains, or lessons learned, ideally with quantifiable data.',
          });
          setOverallComments('');
        } else {
          setStarRemarks(null);
          setOverallComments('');
        }
      }
    } else {
      if (!assignment) return;

      const apiRatings = assignment['Ratings'] as Record<string, unknown> | undefined;
      const apiStarRemarksByCriterion = assignment['StarRemarksByCriterion'] as Record<string, any> | undefined;
      const apiOverallComments = assignment['OverallComments'] as string | undefined;
      const apiStarRemarks = assignment['StarRemarks'] as any;

      if (apiRatings && Object.keys(apiRatings).length > 0) {
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
        setCriterionDetails(getDefaultSubmittedFeedback());
        setOverallComments('');
        setStarRemarks(null);
      }
    }
  }, [assignment, assignmentId, isMyFeedback, selectedReviewer, employeeName]);

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

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            onClick={() => router.push(isMyFeedback ? reviewsFeedbackPath : needsMyReviewPath)}
            sx={{
              height: 40,
              minWidth: 88,
              px: 2.5,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: 'divider',
              color: 'text.primary',
              borderRadius: 1.25,
            }}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            endIcon={<Iconify icon="solar:download-bold" width={18} />}
            sx={{
              height: 40,
              minWidth: 88,
              px: 2.5,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: 'divider',
              color: 'text.primary',
              borderRadius: 1.25,
            }}
          >
            Export
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {isMyFeedback && providers.length > 0 && (
            <Box
              sx={{
                p: 0.75,
                mb: 0,
                borderRadius: '16px',
                bgcolor: '#F4F6F8',
                display: 'flex',
                alignItems: 'center',
                width: 1,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  width: 1,
                  overflowX: { xs: 'auto', md: 'visible' },
                  justifyContent: { xs: 'flex-start', md: 'space-between' },
                  '&::-webkit-scrollbar': { height: 6 },
                }}
              >
                {providers.map((p, idx) => {
                  const isActive = selectedReviewer === p.Name;
                  const avatarSrc = avatarUrlForReviewer(p.Name, idx);
                  const employeeInitial = p.Name.charAt(0).toUpperCase();

                  return (
                    <Box
                      key={p.UserId || p.Name}
                      onClick={() => setSelectedReviewer(p.Name)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        py: 1,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        bgcolor: isActive ? 'background.paper' : 'transparent',
                        border: '1px solid',
                        borderColor: 'transparent',
                        boxShadow: isActive ? (theme) => theme.vars.customShadows.z1 : 'none',
                        transition: 'all 0.2s',
                        flex: { xs: '0 0 auto', md: '1 1 0px' },
                        minWidth: { xs: 160, md: 0 },
                        '&:hover': {
                          bgcolor: isActive ? 'background.paper' : 'action.hover',
                        },
                      }}
                    >
                      <Avatar
                        src={avatarSrc}
                        alt={p.Name}
                        sx={{ width: 32, height: 32, mr: 1.5, flexShrink: 0 }}
                      >
                        {employeeInitial}
                      </Avatar>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: isActive ? 700 : 600,
                          color: isActive ? 'text.primary' : 'text.secondary',
                          fontSize: 13,
                          lineHeight: 1.2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          wordBreak: 'break-word',
                        }}
                      >
                        {p.Name}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}

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
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2.5,
                  color: 'text.primary',
                  fontSize: '18px',
                  fontFamily: 'Henry Sans',
                }}
              >
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
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2.5,
                  color: 'text.primary',
                  fontSize: '18px',
                  fontFamily: 'Henry Sans',
                }}
              >
                STAR Method - Overall Comments
              </Typography>
              <Stack spacing={2}>
                {starRemarks.situation && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                      Situation
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {starRemarks.situation}
                    </Typography>
                  </Box>
                )}
                {starRemarks.task && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                      Task
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {starRemarks.task}
                    </Typography>
                  </Box>
                )}
                {starRemarks.action && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                      Action
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {starRemarks.action}
                    </Typography>
                  </Box>
                )}
                {starRemarks.result && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                      Result
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
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
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2.5,
                  color: 'text.primary',
                  fontSize: '18px',
                  fontFamily: 'Henry Sans',
                }}
              >
                Overall Comments
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'background.neutral',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {overallComments}
                </Typography>
              </Box>
            </Card>
          )}
        </Box>

        <Box
          sx={{
            position: { lg: 'sticky' },
            top: { lg: 'calc(var(--layout-header-desktop-height) + 24px)' },
          }}
        >
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: (theme) => theme.vars.customShadows.z1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'text.primary',
                fontSize: '18px',
                fontFamily: 'Henry Sans',
              }}
            >
              Employee to be Reviewed
            </Typography>

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
                status={isMyFeedback ? 'Completed' : undefined}
                completion={isMyFeedback ? '5/5' : undefined}
                completionDate={isMyFeedback ? '10 Mar 2026 7:00 PM' : undefined}
              />
            )}
          </Card>
        </Box>
      </Box>
    </MainContent>
  );
}
