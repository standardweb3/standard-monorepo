import type { Meta, StoryObj } from '@storybook/react';

import ThemeColorPage from './ThemeColorPage';


const meta = {
  title: 'Type/Theme Colors',
  component: ThemeColorPage,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
}  satisfies Meta<typeof ThemeColorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThemeColors: Story = {}