

// all column types
export const TYPE_COLUMN = 'column';
export const TYPE_BAR = 'bar';
export const TYPE_SCATTERPLOT = 'scatterplot';
export const TYPE_LINE = 'line';
export const TYPE_PIE = 'pie';
export const TYPE_DONUT = 'donut';
export const TYPE_RING = 'ring';

export const DIRECTION_VERTICAL = 'vertical';
export const DIRECTION_HORIZONTAL = 'horizontal';

// charts for showing data
export const MENU_DATA = [
  { 
    type: TYPE_COLUMN,
    direction: DIRECTION_VERTICAL
  },
  { 
    type: TYPE_COLUMN,
    direction: DIRECTION_HORIZONTAL
  },
  { 
    type: TYPE_BAR,
    direction: DIRECTION_VERTICAL
  },
  { 
    type: TYPE_BAR,
    direction: DIRECTION_HORIZONTAL
  },
  { 
    type: TYPE_LINE,
    direction:  null
  },
  { 
    type: TYPE_PIE,
    direction:  null
  },
  { 
    type: TYPE_SCATTERPLOT,
    direction:  null
  },
  // { 
  //   type: TYPE_DONUT,
  //   direction:  null
  // },
  { 
    type: TYPE_RING,
    direction:  null
  }
];