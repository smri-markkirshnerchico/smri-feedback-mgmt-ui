import { SxProps, Theme } from '@mui/material/styles';

export const outlinedInputBorderSx = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'grey.300',
            transition: 'border-color 0.4s ease-in-out, border-width 0.2s ease-in-out',
        },
        '&:hover fieldset': {
            borderColor: 'primary.main',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
            borderWidth: 1,
        },
    },
};

export const standardInputBorderSx = {
    '& .MuiInput-root': {
        '&:before': {
            borderBottom: '1px solid',
            borderBottomColor: 'grey.300',
            transition: 'border-color 0.4s ease-in-out',
        },
        '&:hover:not(.Mui-disabled, .Mui-error):before': {
            borderBottomColor: 'primary.main',
        },
        '&.Mui-focused:after': {
            borderBottomColor: 'primary.main',
        },
    },
};

export const selectInputBorderSx = {
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'grey.300',
        transition: 'border-color 0.4s ease-in-out, border-width 0.2s ease-in-out',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
        borderWidth: 1,
    },
}
export const getToolTipSx = (theme: Theme) => ({
    slotProps: {
        tooltip: {
            sx: {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontSize: 12,
            },
        },
        popper: {
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 8],
                    },
                },
            ],
        },
    },
});

export const gradientContainedButtonSx: SxProps<Theme> = {
    whiteSpace: 'nowrap',
    // ml: 2,
    backgroundImage: (theme: Theme) =>
        theme.palette.mode === 'dark'
            ? `linear-gradient(30deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.primary.light} 100%)`
            :
            // `linear-gradient(30deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.darker} 100%)`,
            `linear-gradient(120deg, ${theme.palette.primary.light} 10%, ${theme.palette.primary.main} 40%, ${theme.palette.primary.dark} 200%)`,

    backgroundSize: '100% 200%',
    backgroundPosition: 'right bottom',
    color: '#fff',
    transition: 'background-position 0.3s ease-in-out',
    '&:hover': {
        backgroundPosition: 'left top',
    },
};