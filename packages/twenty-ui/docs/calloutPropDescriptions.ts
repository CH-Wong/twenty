import { type CalloutProps } from '../src/components/feedback/Callout/types/CalloutProps';

export const CALLOUT_PROP_DESCRIPTIONS = {
  variant: 'Visual style of the notice.',
  title: 'Heading text.',
  description: 'Supporting text.',
  fullWidth: 'Fills the available width.',
  Icon: 'Icon beside the heading.',
  action: 'Optional footer action with caller-owned label and click handler.',
  isClosable: 'Shows the dismiss button.',
  closeLabel: 'Accessible name of the dismiss button. Defaults to `Close`.',
  onClose: 'Called when the user dismisses the notice.',
} satisfies Partial<Record<keyof CalloutProps, string>>;
