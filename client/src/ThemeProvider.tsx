import {
  ColorScheme,
  ColorSchemeProvider,
  Global,
  MantineProvider,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

import theme from '@styles/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider withNormalizeCSS theme={{ ...theme, colorScheme }}>
        <Global
          styles={(theme) => ({
            html: { fontFamily: 'Poppins, sans-serif' },
            body: {
              backgroundColor:
                theme.colorScheme === 'dark' ? '#141517' : '#ffffff',
              color: theme.colorScheme === 'dark' ? '#C1C2C5' : 'initial',
            },
            '*': { boxSizing: 'border-box' },
            '.grecaptcha-badge': {
              display: 'none !important',
            },
            '.mantine-Pagination-item[data-active]': {
              pointerEvents: 'none',
            },
            // a: {
            //   color:
            //     theme.colorScheme === 'dark'
            //       ? '#a6a6a6 !important'
            //       : '#343434 !important',
            // },
          })}
        />
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default ThemeProvider;
