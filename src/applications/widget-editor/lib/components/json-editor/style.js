import styled from 'styled-components';
export const StyledField = styled.div.withConfig({
  displayName: "style__StyledField",
  componentId: "gjto6h-0"
})(["box-sizing:border-box;height:221px;width:100%;border:1px solid rgba(202,204,208,0.85);border-radius:4px;background-color:#FFFFFF;padding:0;font-size:14px;"]);
export const EditorColors = {
  keys: '#C32D7B',
  number: '#2C75B0',
  string: '#C32D7B',
  background: 'white',
  background_warning: '#ffebeb'
};
export const EditorStyles = {
  labelColumn: {
    display: 'none',
    boxSizing: 'border-box'
  },
  body: {
    fontSize: '14px',
    height: '100%',
    width: '100%'
  },
  outerBox: {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  },
  container: {
    height: '100%',
    width: '100%',
    boxSizing: 'border-box'
  },
  warningBox: {
    width: '100%',
    position: 'absolute',
    left: '0',
    bottom: '-62px'
  },
  contentBox: {
    padding: '20px 0 20px 20px',
    height: '100%',
    width: '100%',
    boxSizing: 'border-box'
  }
};