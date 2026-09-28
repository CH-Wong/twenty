import { type ColorSchemePickerProps } from '../src/components/input/ColorSchemePicker/types/ColorSchemePickerProps';

export const COLOR_SCHEME_PICKER_PROP_DESCRIPTIONS = {
  value: 'Selected color scheme.',
  className: 'Class applied to the root.',
  onChange: 'Receives the selected scheme.',
  lightLabel: 'Visible label and accessible name of the light choice.',
  darkLabel: 'Visible label and accessible name of the dark choice.',
  systemLabel: 'Visible label and accessible name of the system choice.',
} satisfies Partial<Record<keyof ColorSchemePickerProps, string>>;
