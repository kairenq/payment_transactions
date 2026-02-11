import { createTheme, alpha } from '@mui/material/styles';

// Modern dark theme with glassmorphism
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#0f172a',
      paper: alpha('#1e293b', 0.8),
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.875rem',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    '0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
    '0 0 0 1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    '0 0 0 1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '0 0 0 1px rgba(0, 0, 0, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
    '0 0 #0000, 0 0 #0000, 0 0 #0000',
  ],
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#0f172a', 0.8),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha('#334155', 0.2)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: alpha('#0f172a', 0.95),
          backdropFilter: 'blur(20px)',
          borderRight: `1px solid ${alpha('#334155', 0.2)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: alpha('#1e293b', 0.6),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#334155', 0.2)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: alpha('#1e293b', 0.6),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#334155', 0.2)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 25px -5px ${alpha('#000', 0.3)}, 0 8px 10px -6px ${alpha('#000', 0.3)}`,
            borderColor: alpha('#3b82f6', 0.3),
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0 10px 15px -3px ${alpha('#3b82f6', 0.3)}, 0 4px 6px -4px ${alpha('#3b82f6', 0.3)}`,
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          backdropFilter: 'blur(20px)',
        },
      },
    },
  },
});

// Glassmorphism card style
export const glassCard = {
  background: alpha('#1e293b', 0.6),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha('#334155', 0.2)}`,
  borderRadius: 16,
  boxShadow: `0 4px 6px -1px ${alpha('#000', 0.1)}, 0 2px 4px -2px ${alpha('#000', 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 20px 25px -5px ${alpha('#000', 0.3)}, 0 8px 10px -6px ${alpha('#000', 0.3)}`,
    borderColor: alpha('#3b82f6', 0.3),
  },
};

// Gradient backgrounds
export const gradients = {
  primary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  info: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  dark: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
};

// Animation variants for framer-motion
export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

export const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};
