import type { Meta, StoryObj } from '@storybook/react';

import NeutralColorPage from './NeutralColorPage';


const meta = {
  title: 'Type/Neutral Colors',
  component: NeutralColorPage,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
}  satisfies Meta<typeof NeutralColorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NeutralColors: Story = {}