declare type MUIColors = 'primary' | 'secondary';
declare type MUIVariants = 'outlined' | 'contained' | 'text';
declare type MUISizes = 'small' | 'medium' | 'large';
declare type ThemeBorder = {
  color: string;
  width: string;
};

declare interface ThemeOptionsConfigValues {
  // Theme Config for ResearchNotes
  ResearchNotesBtnGroupActive: boolean;
  ResearchNotesBtnSize: MUISizes;
  ResearchNotesBtnColor: MUIColors;

  // Theme Config For ResearchComment
  ResearchCommentSize: MUISizes;

  // Theme Config for ResearchSubmitButton
  ResearchSubmitBtnSize: MUISizes;
  ResearchSubmitBtnVariant: MUIVariants;
  ResearchSubmitBtnColor: MUIColors;
}
