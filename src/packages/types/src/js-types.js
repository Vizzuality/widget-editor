import PropTypes from 'prop-types';

export const select = {
  value: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      isDisabled: PropTypes.bool,
    }),
    PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      isDisabled: PropTypes.bool,
    })),
  ]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
          isDisabled: PropTypes.bool,
        })
      ),
      isDisabled: PropTypes.bool,
    })
  ).isRequired
}

export const widget = PropTypes.shape({
  legend: PropTypes.arrayOf(PropTypes.shape({
    values: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      type: PropTypes.string
    }))
  }))
});

export const configuration = PropTypes.shape({
  title: PropTypes.string,
  map: PropTypes.bool,
  chartType: PropTypes.string,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string,
  aggregateFunction: PropTypes.string,
  category: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  }),
  value: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  })
});

export const editor = PropTypes.shape({
  advanced: PropTypes.bool,
  widgetData: PropTypes.object,
  layers: PropTypes.arrayOf(PropTypes.object)
});

export const theme = PropTypes.shape({
  compact: PropTypes.shape({
    isCompact: PropTypes.bool,
    forceCompact: PropTypes.bool,
    isOpen: PropTypes.bool
  })
});
