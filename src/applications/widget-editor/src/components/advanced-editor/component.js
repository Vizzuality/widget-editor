import React, { useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

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
  setEditor,
  setWidgetConfig,
  patchConfiguration,
}) => {
  const stringifiedWidgetConfig = useMemo(
    () => JSON.stringify(serializedWidgetConfig, null, 2),
    [serializedWidgetConfig],
  );

  const [editorValue, setEditorValue] = useState(advanced ? stringifiedWidgetConfig : '');
  const [validationErrors, setValidationErrors] = useState(advanced
    ? getValidationErrors(serializedWidgetConfig)
    : []
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

      const config = JSON.stringify(json, null, 2);
      
      setEditor({ advanced: true });
      setWidgetConfig(JSON.parse(config));
      setEditorValue(config);
    },
    [stringifiedWidgetConfig, setEditor, setWidgetConfig],
  );
  const onSwitchToInteractiveMode = useCallback(
    () => {
      setEditor({ advanced: false });
      setValidationErrors([]);
      
      // We need to render the visualisation again with the editor's settings
      // We introduce a slight delay so that the renderer displays the rest of the UI before we
      // render the visualisation again to avoid the visualisation being below some parts of the UI
      setTimeout(() => patchConfiguration(), 0);
    },
    [setEditor, patchConfiguration],
  );

  const validateAndUpdateStore = useCallback(debounce((value) => {
    try {
      const json = JSON.parse(value);
      const errors = getValidationErrors(json);
      
      if (errors.length) {
        setValidationErrors(errors);
      } else {
        setValidationErrors([]);
        setWidgetConfig(json)
      }
    } catch (e) {
      setValidationErrors(['Cannot parse into a JSON file']);
    }
  }, 1500), [setValidationErrors]);

  const onChange = useCallback((value) => {
    setEditorValue(value);
    validateAndUpdateStore(value);
  }, [validateAndUpdateStore, setEditorValue]);

  useEffect(() => {
    if (!advanced) {
      setEditorValue(stringifiedWidgetConfig);
    }
  }, [advanced, stringifiedWidgetConfig, setEditorValue]);

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
  setEditor: PropTypes.func.isRequired,
  setWidgetConfig: PropTypes.func.isRequired,
  patchConfiguration: PropTypes.func.isRequired,
};

AdvancedEditor.defaultProps = {
  serializedWidgetConfig: null,
};

export default AdvancedEditor;
