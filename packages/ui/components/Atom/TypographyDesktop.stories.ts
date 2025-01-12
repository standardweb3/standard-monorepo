import type { Meta, StoryObj } from '@storybook/react';

import { TypographyDesktop as TypographyDesktopComponent } from './TypographyDesktop';


const meta = {
  title: 'Atom/Typography Desktop',
  component: TypographyDesktopComponent,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
}  satisfies Meta<typeof TypographyDesktopComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypographyDesktop: Story = {}