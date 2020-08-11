import React, { useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from 'prop-types';

import Callout from "components/callout";
import CodeEditor from "components/code-editor";

import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";

import { getValidationErrors } from './helpers';
import { Container, CalloutButton, CalloutLinkButton, ValidationCallout } from "./style";

const AdvancedEditor = ({
  themeColor,
  advanced,
  isEditing,
  isWidgetAdvanced,
  serializedWidgetConfig,
  customWidgetConfig,
  setEditor
}) => {
  const [editorValue, setEditorValue] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  const stringifiedWidgetConfig = useMemo(
    () => JSON.stringify(serializedWidgetConfig, null, 2),
    [serializedWidgetConfig],
  );

  const stringifiedCustomWidgetConfig = useMemo(
    () => JSON.stringify(customWidgetConfig, null, 2),
    [customWidgetConfig],
  );

  const onSwitchToAdvancedMode = useCallback(
    () => {
      const json = JSON.parse(stringifiedWidgetConfig);
      if (json.config) {
        // We rename the scheme “user-default” because when the advanced widget will be saved, the
        // scheme will be given this name
        json.config.name = 'user-custom';
      }

      if (json.paramsConfig) {
        // The widget being advanced, it cannot contain the state of the editor
        delete json.paramsConfig;
      }

      if (json.we_meta) {
        // The widget being advanced, it cannot contain the state of the editor
        delete json.we_meta;
      }

      if (json.$schema) {
        // This key is part of the Vega specification but is not accepted by RW's API
        // As a rule, we decided not to include it in any of the widgets (whether using the RW API
        // or not)
        delete json.$schema;
      }

      const config = JSON.stringify(json, null, 2);
      
      setEditor({
        advanced: true,
        customWidgetConfig: JSON.parse(config),
      })
    },
    [stringifiedWidgetConfig, setEditor],
  );
  const onSwitchToInteractiveMode = useCallback(
    () => {
      setEditor({ advanced: false });
      setValidationErrors([]);
    },
    [setValidationErrors, setEditor],
  );

  const onChange = useCallback((value) => {
    setEditorValue(value);

    try {
      const json = JSON.parse(value);
      const errors = getValidationErrors(json);
      
      if (errors.length) {
        setValidationErrors(errors);
      } else {
        setValidationErrors([]);
        setEditor({ customWidgetConfig: json });
      }
    } catch (e) {
      setValidationErrors(['Cannot parse into a JSON file']);
    }
  }, [setValidationErrors, setEditor]);

  useEffect(() => {
    if (!advanced) {
      setEditorValue(stringifiedWidgetConfig);
    } else {
      setEditorValue(stringifiedCustomWidgetConfig);
    }
  }, [advanced, stringifiedWidgetConfig, stringifiedCustomWidgetConfig, setEditorValue]);

  return (
    <Container>
      {!advanced && (
        <Callout>
          <p>
            The advanced mode is intended for experienced users who want to create or edit a
            widget using code instead of the interactive interface.
          </p>
          <p>
            Once activated, you <strong>cannot</strong> use the interactive interface anymore.
          </p>
          <p>
            <CalloutButton size="small" btnType="highlight" onClick={onSwitchToAdvancedMode}>
              Switch to the advanced mode
            </CalloutButton>
          </p>
        </Callout>
      )}

      {advanced && (!isEditing || !isWidgetAdvanced) && (
        <Callout>
          <p>
            You are using the advanced mode.
          </p>
          <p>
            To go back to the interactive mode,{' '}
            <CalloutLinkButton themeColor={themeColor} onClick={onSwitchToInteractiveMode}>
              click here
            </CalloutLinkButton>
            . <strong>All your code changes will be lost.</strong>
          </p>
        </Callout>
      )}

      {advanced && validationErrors.length > 0 && (
        <ValidationCallout>
          <p>
            The Vega JSON is invalid:
          </p>
          <ul>
            {validationErrors.map(error => <li key={error}>{error}</li>)}
          </ul>
        </ValidationCallout>
      )}

      <InputGroup>
        <FormLabel htmlFor="advanced-textarea">Vega JSON</FormLabel>
        <CodeEditor
          id="advanced-textarea"
          value={editorValue}
          onChange={advanced ? onChange : undefined}
          invalid={validationErrors.length > 0}
          disabled={!advanced}
        />
      </InputGroup>
    </Container>
  );
};

AdvancedEditor.propTypes = {
  themeColor: PropTypes.string.isRequired,
  advanced: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isWidgetAdvanced: PropTypes.bool.isRequired,
  serializedWidgetConfig: PropTypes.object,
  customWidgetConfig: PropTypes.object,
  setEditor: PropTypes.func.isRequired,
};

AdvancedEditor.defaultProps = {
  serializedWidgetConfig: null,
  customWidgetConfig: null,
};

export default AdvancedEditor;
