import React, { useState, useRef, useEffect } from 'react';
import Button from 'components/button';
import {
  StyledAddSection,
  StyledAddModal,
  StyledIcons,
  StyledIconBox,
} from './style';
import {
  TYPE_RANGE,
  TYPE_COLUMNS,
  TYPE_VALUE
} from '../../const';


const AddSection = ({ addFilter, removeFilter, filters }) => {

  const [isAddModal, openAddModal] = useState(false);
  const refModal = useRef(null);
  const refButton = useRef(null);
  const activeFilters = filters ? filters.map(f => f.type) : [];
  const isDisabled = type => activeFilters.indexOf(type) !== -1;
  const handleClickOutside = event =>
    refModal.current
    && refButton.current
    && !refModal.current.contains(event.target)
    && !refButton.current.contains(event.target)
    ? openAddModal(false)
    : null;

  const handleAdd = type => {
    openAddModal(false);
    addFilter(type)
  }

  console.log(refButton);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
        document.removeEventListener('click', handleClickOutside, true);
    };
  });


  return (
    <StyledAddSection>
      <div ref={refButton}>
        <Button
          size="small"
          onClick={() => openAddModal(!isAddModal)}
        >
          Add Filter
        </Button>
      </div>
      {isAddModal && (
        <StyledAddModal ref={refModal}>
          <StyledIcons>
            <StyledIconBox disabled={isDisabled(TYPE_RANGE)}>
              <Button onClick={() => handleAdd(TYPE_RANGE)}>
                Range
              </Button>
            </StyledIconBox>
            <StyledIconBox disabled={isDisabled(TYPE_VALUE)}>
              <Button onClick={() => handleAdd(TYPE_VALUE)}>
                Value
              </Button>
            </StyledIconBox>
            <StyledIconBox disabled={isDisabled(TYPE_COLUMNS)}>
              <Button onClick={() => handleAdd(TYPE_COLUMNS)}>
                Select
              </Button>
            </StyledIconBox>
          </StyledIcons>
        </StyledAddModal>  
      )}
    </StyledAddSection>
  )
}
export default AddSection;