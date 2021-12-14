
import { DefaultTheme, DarkTheme } from 'react-native-paper';
import { processColor } from 'react-native';
import color from 'color';

import { Dimensions } from 'react-native';
import EmailIcon from "../assets/icons/email-icon.svg";
import FacebookIcon from "../assets/icons/facebook-logo.svg";
import GoogleIcon from "../assets/icons/google-color-logo.svg";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const MAIN_COLOR = '#5FC6BA';

export const BACKGROUND_COLOR = '#f1f9ff';
export const TEXT_COLOR = '#395c77';
export const TEXT_COLOR_DISABLED = '#9eadb5';

export const TEXT_SOFT_COLOR = '#7d9eb7';
export const INPUT_BACKGROUND = '#dceaf5';
export const INPUT_BACKGROUND_BORDER = '#d6e9f7';

export const CONTINUE_BACKGROUND = '#5ac26b';
export const CONTINUE_BACKGROUND_BORDER = '#65b36d';
export const CONTINUE_TEXT_COLOR = '#ffffff';

export const FACEBOOK_BACKGROUND = '#3a5898';
export const FACEBOOK_BACKGROUND_BORDER = '#2e4b9b';
export const GOOGLE_BACKGROUND = '#4f8cf7';
export const GOOGLE_BACKGROUND_BORDER = '#5286e5';

export const FONT_BOLD = 'QuicksandBold';
export const FONT_SEMIBOLD = 'QuicksandSemiBold';
export const FONT_MEDIUM = 'QuicksandMedium';
export const FONT_SIZE_TITLE = 50;
export const FONT_SIZE_SUBTITLE = 16;
export const FONT_SIZE_SMALLPRINT = 14;

export const CENTER_WIDTH = Math.min(Math.min(windowWidth, windowHeight) * 0.8, 500);

export const ICON_EMAIL = EmailIcon;
export const ICON_FACEBOOK = FacebookIcon;
export const ICON_GOOGLE = GoogleIcon;