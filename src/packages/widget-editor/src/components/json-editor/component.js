import React from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';
import styled from 'styled-components';

const colors = {
  keys: '#C32D7B',
  number: '#2C75B0',
  string: '#C32D7B',
  background: 'white',
  background_warning: '#ffebeb',
};

const styles = {
  labelColumn: {
    display: "none",
  }
}

const StyledField = styled.div`
  box-sizing: border-box;
  height: 221px;
  width: 100%;
  border: 1px solid rgba(202,204,208,0.85);
  border-radius: 4px;
  background-color: #FFFFFF;
  padding: 20px;
`;

const JsonEditor = () => (
  <StyledField>
    <JSONInput
      id          = 'a_unique_id'
      colors      = { colors }
      locale      = { locale }
      height      = '160px'
      style={styles}
    />
  </StyledField>
)

export default JsonEditor;