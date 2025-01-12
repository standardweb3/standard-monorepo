import type { Meta, StoryObj } from '@storybook/react';

import {ThemeColor} from './ThemeColor';


const meta = {
  title: 'Atom/Theme Colors',
  component: ThemeColor,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
}  satisfies Meta<typeof ThemeColor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThemeColors: Story = {}