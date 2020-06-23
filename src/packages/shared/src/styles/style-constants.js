export const FOOTER_HEIGHT = "100px";

export const DEFAULT_BORDER = (top = 1, right = 1, bottom = 1, left = 1) => `
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.09);

  border-color: rgba(26, 28, 34, 0.1);
  border-style: solid;

  border-width: ${top}px ${right}px ${bottom}px ${left}px;
`;

export const COLOR_WHITE = '#ffffff';

export default {
  FOOTER_HEIGHT,
  DEFAULT_BORDER,
  COLOR_WHITE
};
