import type { Meta, StoryObj } from '@storybook/react';

import {NeutralColor} from './NeutralColor';


const meta = {
  title: 'Atom/Neutral Colors',
  component: NeutralColor,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
}  satisfies Meta<typeof NeutralColor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NeutralColors: Story = {}