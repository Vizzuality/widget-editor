import styled, { css } from 'styled-components';

export const StyledSelectBox = styled.div`
  position: absolute;
  bottom: -30px;
  left: calc(50% - 150px);
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  ${props => props.align === 'vertical' && css`
    bottom: 0;
    left: 0;
    max-width: 60px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;

export const InputStyles = {
  control: () => ({
    display: 'flex',
    border: '1px solid rgba(202,204,208,0.85)',
    borderRadius: '4px',
    padding: '3px 0',
  })
};

export const CustomStyles = {

  container: () => ({
    position: 'relative',
    boxSizing: 'border-box',
    cursor: 'pointer',
  }),
  
  indicatorSeparator: () => ({
    display: 'none',
  }),

  dropdownIndicator: (provided, state) => {
    const { menuIsOpen, align } = state.selectProps;
    return ({
      color: '#c32d7b',
      transform: menuIsOpen && align === 'horizontal' ? 'rotate(180deg)' : 'none',
      transition: 'all 0.2s ease-out',
    });
  },

  indicatorsContainer: () => ({
    color: '#c32d7b',
    display: 'flex',
    padding: '8px',
    transition: 'color 150ms',
    boxSizing: 'border-box',
    position: 'relative',
    top: '5px',
  }),

  control: (provided, state) => {
    const { align, value: { alias = 'Value' } } = state.selectProps;
    const wordPixel = 10;
    const width = `${50 + alias.length * wordPixel}px`;
    const additionalProps = align === 'vertical' ? {
      transform: 'rotate(-90deg)',
    } : null;
    return ({
      margin: "0 auto",
      display: 'flex',
      border: 'none',
      borderRadius: '4px',
      width: width,
      maxWidth: '210px',
      padding: '3px 0',
      ...additionalProps,
    })
  },

  menu: (provided, state) => {
    const { align } = state.selectProps;
    const additionalProps = align === 'vertical' ? {
      position: 'absolute',
      left: '100px',
      top: '-50px',
      bottom: 'auto',
      width: '300px',
    } : null;
    return ({
      ...provided,
      ...additionalProps
    })
  },
}
