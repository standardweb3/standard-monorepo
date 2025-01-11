import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'dark',
  
  // UI
  appBg: '#050505',
  appContentBg: '#050505',
  appBorderColor: 'rgba(256,256,256,.1)',
  appBorderRadius: 4,
  
  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',
  
  // Brand
  brandTitle: 'Standard Exchange UI Kit',
  brandUrl: 'https://standardweb3.com',
  brandImage: '/logo.png',
  brandTarget: '_self',

  // Colors
  colorPrimary: '#1EA7FD',
  colorSecondary: '#0000ff',
});

addons.setConfig({
  theme,
});