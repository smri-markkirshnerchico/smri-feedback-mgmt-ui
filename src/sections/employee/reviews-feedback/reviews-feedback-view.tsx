'use client';

import { useMemo, useState, useCallback, lazy, Suspense } from 'react';
import useSWR from 'swr';

const StartFeedbackModal = lazy(() =>
  import('../start-feedback-modal').then((m) => ({ default: m.StartFeedbackModal }))
);
import { useRouter } from 'next/navigation';
import axios from 'src/lib/axios';
import { endpoints } from 'src/api/endpoints';

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

import { MainContent } from 'src/layouts/main';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableHeadCustom, type TableHeadCellProps } from 'src/components/table';

import { TAB_COUNTS, getReviewFeedbackByTab } from './mock-data';
import { ReviewsFeedbackTableRow } from './reviews-feedback-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD_FEEDBACK: TableHeadCellProps[] = [
  { id: 'employee', label: 'Employee to be Reviewed', width: 240 },
  { id: 'category', label: 'Category', width: 220 },
  { id: 'dateInitiated', label: 'Date Initiated', width: 140 },
  { id: 'status', label: 'Status', width: 160 },
  { id: 'completion', label: 'Completion', width: 110 },
  { id: 'reviewer', label: 'Reviewer', width: 160 },
  { id: 'avgScore', label: 'Avg. Score', width: 90 },
];

const TABLE_HEAD_NEEDS_REVIEW: TableHeadCellProps[] = [
  { id: 'employee', label: 'Employee to be Reviewed', width: 240 },
  { id: 'category', label: 'Category', width: 220 },
  { id: 'dateInitiated', label: 'Date Initiated', width: 140 },
  { id: 'status', label: 'Status', width: 160 },
];

type EmployeeReviewFeedbackTab = 'my-feedback' | 'needs-my-review';

interface FeedbackAssignmentDto {
  AssignmentId: string;
  FeedbackRequestId: string;
  EmployeeToReviewId: string;
  EmployeeToReviewName: string;
  ReviewerId: string;
  ReviewerName: string;
  Category: string;
  Year: string;
  Position: string;
  ProjectName?: string;
  Reason: string;
  Status: string;
  CreatedAt: string;
}

const TAB_PATHS: Record<EmployeeReviewFeedbackTab, string> = {
  'my-feedback': paths.main.employee.myFeedback,
  'needs-my-review': paths.main.employee.needsMyReview,
};

const TAB_LABELS: Record<EmployeeReviewFeedbackTab, string> = {
  'my-feedback': 'My Feedback',
  'needs-my-review': 'Needs My Review',
};

// ----------------------------------------------------------------------

type Props = {
  currentTab: EmployeeReviewFeedbackTab;
};

export function ReviewsFeedbackView({ currentTab }: Readonly<Props>) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data: needsMyReviewFeedback = [], isLoading: needsMyReviewLoading } = useSWR(
    currentTab === 'needs-my-review' ? endpoints.application.feedbackAssignment.root : null,
    async (url) => {
      const res = await axios.get<FeedbackAssignmentDto[]>(url);
      return res.data
        .filter((a) => (a as any).status === 'pending' || a.Status === 'pending')
        .map((a) => ({
          id: a.AssignmentId,
          employeeName: a.EmployeeToReviewName,
          employeeAvatarUrl: undefined,
          category: `${a.Category} ${a.Year}`,
          dateInitiated: a.CreatedAt,
          status: 'in-progress' as const,
          statusLabel: 'Pending',
          completion: '0/1',
          reviewerAvatarUrls: [],
          avgScore: null,
          feedbackAssignment: a,
        }));
    }
  );

  const tableData = useMemo(() => {
    if (currentTab === 'needs-my-review') {
      return needsMyReviewFeedback;
    }
    return getReviewFeedbackByTab(currentTab);
  }, [currentTab, needsMyReviewFeedback]);

  const dataFiltered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return tableData;

    return tableData.filter(
      (item) =>
        item.employeeName.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword)
    );
  }, [search, tableData]);

  const handleChangeTab = useCallback(
    (_: React.SyntheticEvent, value: EmployeeReviewFeedbackTab) => {
      router.push(TAB_PATHS[value]);
    },
    [router]
  );

  const renderTabLabel = (tab: EmployeeReviewFeedbackTab) => {
    let count = TAB_COUNTS[tab];
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
          onClick={() => setModalOpen(true)}
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
            {(Object.keys(TAB_LABELS) as EmployeeReviewFeedbackTab[]).map((tab) => (
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
                  bgcolor: 'transparent',
                  borderBottom: 'none',
                },
              }}
            >
              <TableHeadCustom headCells={currentTab === 'needs-my-review' ? TABLE_HEAD_NEEDS_REVIEW : TABLE_HEAD_FEEDBACK} />

              <TableBody>
                {dataFiltered.map((row) => (
                  <ReviewsFeedbackTableRow
                    key={row.id}
                    row={row}
                    showStartFeedbackButton={currentTab === 'needs-my-review'}
                    onStartFeedback={
                      currentTab === 'needs-my-review'
                        ? () => {
                            // TODO: Open modal to start providing feedback
                          }
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

      <Suspense fallback={null}>
        <StartFeedbackModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </Suspense>
    </MainContent>
  );
}
