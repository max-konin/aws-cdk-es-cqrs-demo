import { type FC, type PropsWithChildren } from 'react';
import {
  Authenticator,
  useTheme,
  View,
  Image,
  Text,
  Theme,
  ThemeProvider,
} from '@aws-amplify/ui-react';

const AppAuthenticator: FC<PropsWithChildren> = ({ children }) => {
  const { tokens } = useTheme();

  // https://ui.docs.amplify.aws/react/components/button#theme
  // https://ui.docs.amplify.aws/react/connected-components/authenticator/customization#styling
  const theme: Theme = {
    name: 'tradelanes-primary-theme',
    tokens: {
      colors: {
        border: {
          // primary: { value: 'red' },
        },
      },
      components: {
        button: {
          primary: {
            backgroundColor: { value: '{colors.blue.60}' },
          },
        },
      },
    },
  };

  const components = {
    Header() {
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Image
            alt="Tradelanes logo"
            src="/assets/images/tradelanes-final-up-100px-height.png"
          />
        </View>
      );
    },

    Footer() {
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Text color={tokens.colors.neutral[80]}>
            &copy; All Rights Reserved
          </Text>
        </View>
      );
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Authenticator components={components}>
        {children}
      </Authenticator>
    </ThemeProvider>
  );
};

export default AppAuthenticator;
