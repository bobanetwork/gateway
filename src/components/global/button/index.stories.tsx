import React from 'react'
import { Meta, StoryFn } from '@storybook/react'

import { Button } from './'
import { ButtonTypes } from './types'

export default {
  title: 'Components/Button',
  component: Button,
} as Meta

const Template: StoryFn<ButtonTypes> = (args: any) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
  disabled: false,
  loading: false,
  label: 'Default Button',
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  loading: false,
  label: 'Disabled Button',
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true,
  disabled: false,
  label: 'Loading...',
}

export const Small = Template.bind({})
Small.args = {
  disabled: false,
  loading: false,
  small: true,
  label: 'Default Button',
}

export const Outline = Template.bind({})
Outline.args = {
  disabled: false,
  loading: false,
  small: false,
  outline: true,
  label: 'Default Button',
}
