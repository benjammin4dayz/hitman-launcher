import { createSystem, defaultConfig } from '@chakra-ui/react';

export default createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'Roboto, sans-serif' },
        body: { value: 'Roboto, sans-serif' },
      },
      fontWeights: {
        normal: { value: 400 },
        medium: { value: 500 },
        bold: { value: 700 },
      },
      colors: {
        phillippineRed: {
          DEFAULT: { value: '#CE1924' },
        },
        bloodRed: {
          DEFAULT: { value: '#660200' },
        },
        lotion: {
          DEFAULT: { value: '#FAFAFA' },
        },
        pastelPink: {
          DEFAULT: { value: '#DCB09E' },
        },
        almond: {
          DEFAULT: { value: '#EDD6CC' },
        },
      },
    },
  },
});
