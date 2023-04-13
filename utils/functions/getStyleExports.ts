import rawStyleExports from '@/styles/_exports.module.scss';

type StyleExports = {
  palettes: string[];
  light: string;
  dark: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
};

const styleExports: StyleExports = {
  ...rawStyleExports,
  palettes: rawStyleExports.palettes.replace(/"/g, '').split(', ')
} as StyleExports;

/**
 * Get export style variables.
 */
export const getStyleExports = () => styleExports;
