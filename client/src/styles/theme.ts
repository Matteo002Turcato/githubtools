import { MantineThemeOverride } from '@mantine/core';

// const theme: MantineThemeOverride = {
//   fontFamily: 'Poppins, sans-serif',

//   headings: {
//     fontFamily: 'Poppins, sans-serif',
//     sizes: {
//       h1: {
//         fontSize: '1.5rem',
//       },
//       h2: {
//         fontSize: '1.2rem',
//       },
//     },
//   },

//   black: '#222222',
//   colors: {
//     brand: [
//       '#222222',
//       '#252525',
//       '#282828',
//       '#2C2C2C',
//       '#303030',
//       '#343434',
//       '#393939',
//       '#343434',
//       '#393939',
//       '#3E3E3E',
//     ],
//   },
//   primaryColor: 'brand',

//   defaultRadius: 'md',

//   loader: 'dots',

//   components: {
//     TextInput: {
//       defaultProps: {
//         size: 'xs',
//       },
//     },
//     PasswordInput: {
//       defaultProps: {
//         size: 'xs',
//       },
//     },
//     Textarea: {
//       defaultProps: {
//         size: 'xs',
//       },
//     },
//     NumberInput: {
//       defaultProps: {
//         size: 'xs',
//       },
//     },
//     DatePicker: {
//       defaultProps: {
//         size: 'xs',
//       },
//     },
//     Paper: {
//       defaultProps: {
//         withBorder: true,
//         shadow: 'md',
//         radius: 'lg',
//       },
//     },
//     Select: {
//       defaultProps: {
//         size: 'xs',
//       },
//       styles: {
//         itemsWrapper: { width: 'auto !important' },
//         item: {
//           '&[data-selected]': {
//             backgroundColor: '#f1f3f5 !important',
//             color: 'black',
//             // overflow: 'hidden',
//             // whiteSpace: 'nowrap',
//             // textOverflow: 'ellipsis',
//           },
//         },
//       },
//     },
//     MultiSelect: { defaultProps: { size: 'xs' } },
//     Switch: {
//       defaultProps: {
//         size: 'xs',
//       },
//       styles: {
//         track: {
//           cursor: 'pointer',
//         },
//       },
//     },
//   },
// };
const theme: MantineThemeOverride = {
  fontFamily: 'Segoe UI, sans-serif',

  headings: {
    fontFamily: 'Segoe UI, sans-serif',
    sizes: {
      h1: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 'bold',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
      },
      h5: {
        fontSize: '1rem',
        fontWeight: 'bold',
      },
      h6: {
        fontSize: '0.875rem',
        fontWeight: 'bold',
      },
    },
  },

  colors: {
    brand: [
      '#020409', // background
      '#0E1116', //sidebar
      '#171B21', //topbar
      '#529E4E', // bottoni
      '#F8F9FA', // text
    ],
  },
  primaryColor: 'brand',

  defaultRadius: 'sm',

  loader: 'bars',

  components: {
    TextInput: {
      defaultProps: {
        size: 'sm',
      },
    },
    PasswordInput: {
      defaultProps: {
        size: 'sm',
      },
    },
    Textarea: {
      defaultProps: {
        size: 'sm',
      },
    },
    NumberInput: {
      defaultProps: {
        size: 'sm',
      },
    },
    DatePicker: {
      defaultProps: {
        size: 'sm',
      },
    },
    Paper: {
      defaultProps: {
        withBorder: true,
        shadow: 'sm',
        radius: 'sm',
      },
    },
    Select: {
      defaultProps: {
        size: 'sm',
      },
      styles: {
        itemsWrapper: { width: 'auto !important' },
        item: {
          '&[data-selected]': {
            backgroundColor: '#f6f8fa !important',
            color: 'black',
          },
        },
      },
    },
    MultiSelect: { defaultProps: { size: 'sm' } },
    Switch: {
      defaultProps: {
        size: 'sm',
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
