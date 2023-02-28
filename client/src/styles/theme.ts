import { MantineThemeOverride } from '@mantine/core';

const theme: MantineThemeOverride = {
  fontFamily: 'Poppins, sans-serif',

  headings: {
    fontFamily: 'Poppins, sans-serif',
    sizes: {
      h1: {
        fontSize: '1.5rem',
      },
      h2: {
        fontSize: '1.2rem',
      },
    },
  },

  black: '#222222',
  colors: {
    brand: [
      '#222222',
      '#252525',
      '#282828',
      '#2C2C2C',
      '#303030',
      '#343434',
      '#393939',
      '#343434',
      '#393939',
      '#3E3E3E',
    ],
  },
  primaryColor: 'brand',

  defaultRadius: 'md',

  loader: 'dots',

  components: {
    TextInput: {
      defaultProps: {
        size: 'xs',
      },
    },
    PasswordInput: {
      defaultProps: {
        size: 'xs',
      },
    },
    Textarea: {
      defaultProps: {
        size: 'xs',
      },
    },
    NumberInput: {
      defaultProps: {
        size: 'xs',
      },
    },
    DatePicker: {
      defaultProps: {
        size: 'xs',
      },
    },
    Paper: {
      defaultProps: {
        withBorder: true,
        shadow: 'md',
        radius: 'lg',
      },
    },
    Select: {
      defaultProps: {
        size: 'xs',
      },
      styles: {
        itemsWrapper: { width: 'auto !important' },
        item: {
          '&[data-selected]': {
            backgroundColor: '#f1f3f5 !important',
            color: 'black',
            // overflow: 'hidden',
            // whiteSpace: 'nowrap',
            // textOverflow: 'ellipsis',
          },
        },
      },
    },
    MultiSelect: { defaultProps: { size: 'xs' } },
    Switch: {
      defaultProps: {
        size: 'xs',
      },
      styles: {
        track: {
          cursor: 'pointer',
        },
      },
    },
  },
};

export default theme;
