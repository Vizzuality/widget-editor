import React from 'react';

import { CategoryIcon, NumberIcon, DateIcon, UnknownIcon } from 'components/icons';
import { StyledColumnOption, StyledColumnOptionDescription } from './style';

/**
 * Return the option label formatter for a select that displays columns
 * @param {{ label: string, value: any, [key: string]: any }} option 
 */
export const columnLabelFormatter = (option, { context }) => {
  if (option.type === undefined || option.type === null) {
    return (
      <StyledColumnOption overflow={context === 'menu'}>
        {option.label}
      </StyledColumnOption>
    );
  }

  let Icon;
  switch (option.type) {
    case 'string':
      Icon = CategoryIcon;
      break;
    case 'number':
      Icon = NumberIcon;
      break;
    case 'date':
      Icon = DateIcon;
      break;
    default:
      Icon = UnknownIcon;
  }

  return (
    <StyledColumnOption overflow={context === 'menu'}>
      <Icon /> {option.label}
      {context === 'menu' && option.description && (
        <StyledColumnOptionDescription>
          {option.description}
        </StyledColumnOptionDescription>
      )}
    </StyledColumnOption>
  );
};