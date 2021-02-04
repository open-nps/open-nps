declare type MUIColors = 'primary' | 'secondary';
declare type MUIVariants = 'outlined' | 'contained' | 'text';
declare type MUISizes = 'small' | 'medium' | 'large';
declare type ThemeBorder = {
  color: string;
  width: string;
};

declare interface ThemeOptionsConfigValues {
  // Theme Config for SurveyNotes
  SurveyNotesBtnGroupActive: boolean;
  SurveyNotesBtnSize: MUISizes;
  SurveyNotesBtnColor: MUIColors;

  // Theme Config For SurveyComment
  SurveyCommentSize: MUISizes;

  // Theme Config for SurveySubmitButton
  SurveySubmitBtnSize: MUISizes;
  SurveySubmitBtnVariant: MUIVariants;
  SurveySubmitBtnColor: MUIColors;
  SurveySubmitBtnFullWidth: boolean;

  // SurveyPage
  SurveyBoxBorderSize: string;
  SurveyBoxBorderRadius: string;
  SurveyTopBrandImage?: {
    url: string;
    alt?: string;
    width?: string;
  };

  // ThanksPage
  ThanksTopImage?: {
    url: string;
    alt?: string;
    width?: string;
  };

  Error: {
    duration: number;
    closeOption: boolean;
    elevation: number;
  };
}
