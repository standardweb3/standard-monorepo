import type { Meta, StoryObj } from '@storybook/react';

import { TypographyTablet as TypographyTabletComponent } from './TypographyTablet';


const meta = {
  title: 'Atom/Typography Tablet',
  component: TypographyTabletComponent,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
}  satisfies Meta<typeof TypographyTabletComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypographyTablet: Story = {}