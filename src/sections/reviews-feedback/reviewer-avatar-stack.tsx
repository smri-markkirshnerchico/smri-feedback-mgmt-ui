'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

const AVATAR_SIZE = 28;
const AVATAR_OVERLAP = 8;
const MAX_VISIBLE = 5;
const STACK_WIDTH = AVATAR_SIZE + (MAX_VISIBLE - 1) * (AVATAR_SIZE - AVATAR_OVERLAP);

const AVATAR_COLOR_CYCLE = ['success', 'info', 'warning', 'info', 'primary'] as const;

type Props = {
  reviewers: string[];
};

function getInitial(label: string) {
  const trimmed = label.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

export function ReviewerAvatarStack({ reviewers }: Readonly<Props>) {
  const visible = reviewers.slice(0, MAX_VISIBLE);
  const overflow = reviewers.length - MAX_VISIBLE;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: STACK_WIDTH,
        minWidth: STACK_WIDTH,
        flexShrink: 0,
      }}
    >
      {visible.map((item, index) => {
        const isImage = item.startsWith('http');

        return (
          <Avatar
            key={`${item}-${index}`}
            src={isImage ? item : undefined}
            alt={item}
            color={isImage ? undefined : AVATAR_COLOR_CYCLE[index % AVATAR_COLOR_CYCLE.length]}
            sx={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              fontSize: 12,
              fontWeight: 700,
              border: '2px solid',
              borderColor: 'background.paper',
              boxSizing: 'content-box',
              marginLeft: index === 0 ? 0 : `-${AVATAR_OVERLAP}px`,
              zIndex: visible.length - index,
            }}
          >
            {!isImage && getInitial(item)}
          </Avatar>
        );
      })}

      {overflow > 0 && (
        <Avatar
          sx={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            fontSize: 11,
            fontWeight: 700,
            bgcolor: 'action.hover',
            color: 'text.secondary',
            border: '2px solid',
            borderColor: 'background.paper',
            boxSizing: 'content-box',
            marginLeft: `-${AVATAR_OVERLAP}px`,
            zIndex: 0,
          }}
        >
          +{overflow}
        </Avatar>
      )}
    </Box>
  );
}
