'use client';

import type { IReviewFeedbackItem, ReviewFeedbackTab } from 'src/types/review-feedback';

import { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { endpoints } from 'src/api/endpoints';
import axios from 'src/lib/axios';

import { MainContent } from 'src/layouts/main';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableHeadCustom, type TableHeadCellProps } from 'src/components/table';

import { mapFeedbackAssignments } from 'src/sections/reviews-feedback/map-feedback-assignment';

import { TAB_COUNTS, getReviewFeedbackByTab } from './mock-data';
import { ReviewsFeedbackTableRow } from './reviews-feedback-table-row';
import { FeedbackListApprovalModal } from './feedback-list-approval-modal';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'employee', label: 'Employee to be Reviewed', width: 240 },
  { id: 'category', label: 'Category', width: 220 },
  { id: 'dateInitiated', label: 'Date Initiated', width: 140 },
  { id: 'status', label: 'Status', width: 160 },
  { id: 'completion', label: 'Completion', width: 110 },
  { id: 'reviewer', label: 'Reviewer', width: 160 },
  { id: 'avgScore', label: 'Avg. Score', width: 90 },
];

const TAB_PATHS: Record<ReviewFeedbackTab, string> = {
  'my-feedback': paths.main.manager.myFeedback,
  'needs-my-review': paths.main.manager.needsMyReview,
  'my-teams-review': paths.main.manager.myTeamsReview,
};

const TAB_LABELS: Record<ReviewFeedbackTab, string> = {
  'my-feedback': 'My Feedback',
  'needs-my-review': 'Needs My Review',
  'my-teams-review': 'My Teams Review',
};

// ----------------------------------------------------------------------

type Props = {
  currentTab: ReviewFeedbackTab;
};

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

export function ReviewsFeedbackView({ currentTab }: Readonly<Props>) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IReviewFeedbackItem | null>(null);

  const { data: teamFeedback = [], isLoading: teamFeedbackLoading, mutate: mutateTeamFeedback } = useSWR(
    endpoints.application.feedback.root,
    async (url) => {
      const res = await axios.get<FeedbackRequestDto[]>(url);
      return res.data
        .filter((f) => f.Status === 'submitted' || f.Status === 'for-your-approval')
        .map((f) => ({
          id: f.FeedbackId,
          employeeName: f.RequestorName,
          employeeAvatarUrl: undefined,
          category: `${f.Category} ${f.Year}`,
          dateInitiated: f.CreatedAt,
          status: 'for-your-approval' as const,
          statusLabel: 'For your Approval',
          completion: `0/${f.Providers.length}`,
          reviewerAvatarUrls: f.Providers.map((p) => p.Name),
          avgScore: null,
          feedbackRequest: f, // Store the original data
        })) as (IReviewFeedbackItem & { feedbackRequest: FeedbackRequestDto })[];
    }
  );

  const { data: needsMyReviewFeedback = [], isLoading: needsMyReviewLoading, mutate: mutateNeedsMyReview } = useSWR(
    endpoints.application.feedbackAssignment.root,
    async (url) => {
      const res = await axios.get<unknown[]>(url);
      return mapFeedbackAssignments(res.data);
    }
  );

  const tableData = useMemo(() => {
    if (currentTab === 'my-teams-review') {
      return teamFeedback;
    }
    if (currentTab === 'needs-my-review') {
      return needsMyReviewFeedback;
    }
    return getReviewFeedbackByTab(currentTab);
  }, [currentTab, teamFeedback, needsMyReviewFeedback]);

  const dataFiltered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return tableData;

    return tableData.filter(
      (item) =>
        (item.employeeName ?? '').toLowerCase().includes(keyword) ||
        (item.category ?? '').toLowerCase().includes(keyword)
    );
  }, [search, tableData]);

  const handleChangeTab = useCallback(
    (_: React.SyntheticEvent, value: ReviewFeedbackTab) => {
      router.push(TAB_PATHS[value]);
    },
    [router]
  );

  const handleRowClick = useCallback(
    (row: IReviewFeedbackItem) => {
      if (currentTab !== 'my-teams-review') return;
      setSelectedRow(row);
      setApprovalOpen(true);
    },
    [currentTab]
  );

  const handleCloseApproval = useCallback(() => {
    setApprovalOpen(false);
    setSelectedRow(null);
  }, []);

  const renderTabLabel = (tab: ReviewFeedbackTab) => {
    let count = TAB_COUNTS[tab];
    if (tab === 'my-teams-review') count = teamFeedback.length;
    if (tab === 'needs-my-review') count = needsMyReviewFeedback.length;
    const isActive = currentTab === tab;

    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <span>{TAB_LABELS[tab]}</span>
        <Box
          component="span"
          sx={{
            minWidth: 22,
            height: 22,
            px: 0.75,
            typography: 'caption',
            fontWeight: 700,
            lineHeight: '22px',
            textAlign: 'center',
            borderRadius: 0.75,
            ...(isActive
              ? { bgcolor: 'warning.lighter', color: 'warning.dark' }
              : { bgcolor: 'action.hover', color: 'text.secondary' }),
          }}
        >
          {count}
        </Box>
      </Stack>
    );
  };

  return (
    <MainContent maxWidth={false}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" sx={{ color: 'primary.main', mb: 0.5, fontFamily: 'Henry Sans' }}>
            Reviews & Feedback
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 620 }}>
            Supporting employee development through regular reviews and open communication
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          endIcon={<Iconify icon="mingcute:add-line" />}
          sx={{ borderRadius: 1.5, flexShrink: 0, px:2, py:1.5 }}
        >
          Start your Feedback
        </Button>
      </Stack>

      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, pt:1, pl:3 }}>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              mb: 1,
              borderBottom: '1px solid',
              borderBottomColor: 'divider',
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                bgcolor: 'primary.main',
              },
            }}
          >
            {(Object.keys(TAB_LABELS) as ReviewFeedbackTab[]).map((tab) => (
              <Tab key={tab} value={tab} label={renderTabLabel(tab)} sx={{ minHeight: 48, px: 0, mr: 1 }} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ px: 2, py:0, pb: 0 }}>
          <TextField
            fullWidth
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                bgcolor: 'background.neutral',
              },
            }}
          />
        </Box>

        <Box sx={{ position: 'relative', px: 2.5, pb: 2.5, pt: 2 }}>
          <Scrollbar>
            <Table
              sx={{
                minWidth: 1080,
                borderCollapse: 'separate',
                borderSpacing: '0 8px',
                '& .MuiTableCell-head': {
                  color: 'text.secondary',
                  fontWeight: 600,
                  bgcolor: '#f5f5f5',
                  borderBottom: 'none',
                },
              }}
            >
              <TableHeadCustom headCells={TABLE_HEAD} />

              <TableBody>
                {dataFiltered.map((row) => (
                  <ReviewsFeedbackTableRow
                    key={row.id}
                    row={row}
                    onClick={
                      currentTab === 'my-teams-review'
                        ? () => handleRowClick(row)
                        : undefined
                    }
                    showStartFeedbackButton={currentTab === 'needs-my-review'}
                    onStartFeedback={
                      currentTab === 'needs-my-review'
                        ? () => router.push(paths.main.manager.provideFeedback(row.id))
                        : undefined
                    }
                    onViewFeedback={
                      currentTab === 'needs-my-review'
                        ? () => router.push(paths.main.manager.provideFeedback(row.id, { view: true }))
                        : undefined
                    }
                  />
                ))}

                <TableNoData notFound={!dataFiltered.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>
      </Card>

      <FeedbackListApprovalModal
        open={approvalOpen}
        onClose={handleCloseApproval}
        item={selectedRow}
        feedbackRequest={(selectedRow as any)?.feedbackRequest}
        onApproveSuccess={() => {
          handleCloseApproval();
          mutateTeamFeedback();
        }}
        onRejectSuccess={() => {
          handleCloseApproval();
          mutateTeamFeedback();
        }}
      />
    </MainContent>
  );
}
