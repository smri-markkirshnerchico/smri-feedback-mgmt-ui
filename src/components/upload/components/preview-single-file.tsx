import type { IconButtonProps } from '@mui/material/IconButton';

import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { Iconify } from '../../iconify';
import { uploadClasses } from '../classes';

import type { SingleFilePreviewProps } from '../types';
import { useState } from 'react';
import { Stack, Typography } from '@mui/material';



// ----------------------------------------------------------------------

export function SingleFilePreview({ file, sx, className, ...other }: SingleFilePreviewProps) {
  const fileName = typeof file === 'string' ? file : file.name;

  const previewUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

  const [hasError, setHasError] = useState(false);

  const getFallbackImage = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();

    switch (extension) {
      case 'pdf':
        return '/assets/icons/files/ic-pdf.svg';
      case 'doc':
      case 'docx':
        return '/assets/icons/files/ic-word.svg';
      case 'xls':
      case 'xlsx':
      case 'csv':
        return '/assets/icons/files/ic-excel.svg';
      case 'ppt':
      case 'pptx':
        return '/assets/icons/files/ic-power_point.svg';
      case 'txt':
        return '/assets/icons/files/ic-txt.svg';
      case 'zip':
      case 'rar':
      case '7z':
        return '/assets/icons/files/ic-zip.svg';
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
        return '/assets/icons/files/ic-audio.svg';
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
        return '/assets/icons/files/ic-video.svg';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
      case 'webp':
        return '/assets/icons/files/ic-img.svg';
      default:
        return '/assets/icons/files/ic-document.svg';
    }
  };

  const fallbackImage = getFallbackImage(fileName);

  return (
    <PreviewRoot
      className={mergeClasses([uploadClasses.uploadSinglePreview, className])}
      sx={sx}
      {...other}
    >
      <Stack direction="row" spacing={2} alignItems="center" >
        <img alt={fileName}
          src={!hasError ? previewUrl : fallbackImage}
          onError={() => setHasError(true)} />
        {hasError && (
          <Typography variant='subtitle1'>
            {fileName}
          </Typography>
        )}
      </Stack>
    </PreviewRoot>
  );
}

// ----------------------------------------------------------------------

const PreviewRoot = styled('div')(({ theme }) => ({
  // top: 0,
  // left: 0,
  // width: '100%',
  // height: '100%',
  // position: 'absolute',
  // padding: theme.spacing(1),
  // '& > img': {
  //   width: '100%',
  //   height: '100%',
  //   objectFit: 'cover',
  //   borderRadius: theme.shape.borderRadius,
  // },
}));

// ----------------------------------------------------------------------

export function DeleteButton({ sx, ...other }: IconButtonProps) {
  return (
    <IconButton
      size="small"
      sx={[
        (theme) => ({
          top: 16,
          right: 16,
          zIndex: 9,
          position: 'absolute',
          color: varAlpha(theme.vars.palette.common.whiteChannel, 0.8),
          bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.72),
          '&:hover': { bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.48) },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );
}
