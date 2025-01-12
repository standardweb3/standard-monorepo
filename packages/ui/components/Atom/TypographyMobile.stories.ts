import type { Meta, StoryObj } from '@storybook/react';

import { TypographyMobile as TypographyMobileComponent } from './TypographyMobile';


const meta = {
  title: 'Atom/Typography Mobile',
  component: TypographyMobileComponent,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
}  satisfies Meta<typeof TypographyMobileComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypographyMobile: Story = {}