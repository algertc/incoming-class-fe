import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Primary colors from the provided palette
const darkPurple = '#060405';
const white = '#ffffff';

// Create simplified shades for each color
const blueShades: MantineColorsTuple = [
  '#eef1ff', // 0: Lightest
  '#dde3ff', // 1
  '#c1cbff', // 2
  '#a5b3fc', // 3
  '#8a9bfa', // 4
  '#4a5dfd', // 5: Base color
  '#4860e0', // 6
  '#3c51c9', // 7
  '#2f41b1', // 8
  '#23329a'  // 9: Darkest
];

const yellowShades: MantineColorsTuple = [
  '#fff9e0', // 0: Lightest
  '#fef5cc', // 1
  '#fdeeb3', // 2
  '#fce799', // 3
  '#fadf80', // 4
  '#f7d74b', // 5: Base color
  '#e6c73a', // 6
  '#d4b729', // 7
  '#c1a71d', // 8
  '#af9710'  // 9: Darkest
];

const coralShades: MantineColorsTuple = [
  '#ffece9', // 0: Lightest
  '#ffd9d3', // 1
  '#ffc6bc', // 2
  '#ffb2a5', // 3
  '#ff9e8e', // 4
  '#fad95f', // 5: Base color
  '#e04d30', // 6
  '#cf3c20', // 7
  '#be2c12', // 8
  '#ad1c05'  // 9: Darkest
];

// Create simplified theme
const THEME = createTheme({
  // Set primary color
  primaryColor: 'blue',
  fontFamily: "Cascadia Mono",
  // Define color palette
  colors: {
    blue: blueShades,
    yellow: yellowShades,
    coral: coralShades,
    dark: [
      '#f8f9fa', // 0
      '#e9ecef', // 1
      '#dee2e6', // 2
      '#ced4da', // 3
      '#adb5bd', // 4
      '#6c757d', // 5
      '#495057', // 6
      '#343a40', // 7
      '#212529', // 8
      darkPurple  // 9
    ],
  },

  white: white,
  black: darkPurple,

});

export default THEME;