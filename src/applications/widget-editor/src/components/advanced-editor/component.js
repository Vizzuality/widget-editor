import React, { Fragment } from "react";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";

import Callout from "components/callout";
import CodeEditor from "components/code-editor";

import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";

import { CalloutButton, CalloutLinkButton } from "./style";

const CODE_BLOCK_PLACEHOLDER = "// Enter custom vega configuration";

class AdvancedEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdateConfig = this.handleUpdateConfig.bind(this);
    this.onSwitchToAdvancedMode = this.onSwitchToAdvancedMode.bind(this);
    this.onSwitchToInteractiveMode = this.onSwitchToInteractiveMode.bind(this);
    this.state = {
      invalidConfig: false,
      advanced: props.editor.advanced,
      vegaConfig: props.editor.customConfiguration
        ? JSON.stringify(props.editor.customConfiguration, null, 2)
        : CODE_BLOCK_PLACEHOLDER,
    };
  }

  componentDidUpdate(_, previousState) {
    try {
      const prevVegaConfig = previousState.vegaConfig;
      const currVegaConfig = this.state.vegaConfig;
      if (!isEqual(prevVegaConfig, currVegaConfig)) {
        this.handleUpdateConfig();
      }
    } catch (_) {}
  }

  handleUpdateConfig = debounce(() => {
    const { setEditor, setWidget } = this.props;
    const { vegaConfig } = this.state;

    if (!vegaConfig || vegaConfig === CODE_BLOCK_PLACEHOLDER) {
      setEditor({
        advanced: false,
        customConfiguration: null,
      });
      return;
    }

    try {
      const parseConfig = JSON.parse(vegaConfig);
      const widgetConfig = parseConfig;
      setEditor({
        advanced: true,
        customConfiguration: widgetConfig,
      });
      setWidget(widgetConfig);
      this.setState({ invalidConfig: false });
    } catch (_) {
      this.setState({ invalidConfig: true });
    }
  }, 1000);

  onSwitchToAdvancedMode() {
    const { setEditor } = this.props;
    setEditor({
      advanced: true
    });
  }

  onSwitchToInteractiveMode() {
    const { setEditor } = this.props;
    setEditor({
      advanced: false
    });
  }

  render() {
    const { advanced, isEditing, isWidgetAdvanced, themeColor } = this.props;
    const { vegaConfig = "", invalidConfig } = this.state;

    return (
      <Fragment>
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
              <CalloutButton size="small" btnType="highlight" onClick={this.onSwitchToAdvancedMode}>
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
              <CalloutLinkButton themeColor={themeColor} onClick={this.onSwitchToInteractiveMode}>
                click here
              </CalloutLinkButton>
              . <strong>All your code changes will be lost.</strong>
            </p>
          </Callout>
        )}
        <InputGroup>
          <FormLabel invalid={invalidConfig} htmlFor="options-title">
            Vega JSON{" "}
            {invalidConfig && (
              <span>Error: Invalid JSON, make sure to input valid JSON</span>
            )}
          </FormLabel>
          <CodeEditor
            data={vegaConfig}
            type="json"
            onFocus={() => {
              if (vegaConfig === CODE_BLOCK_PLACEHOLDER) {
                this.setState({ vegaConfig: "" });
              }
            }}
            onBlur={() => {
              if (vegaConfig === "") {
                this.setState({
                  vegaConfig: CODE_BLOCK_PLACEHOLDER,
                });
              }
            }}
            onChange={(code) => this.setState({ vegaConfig: code })}
          />
        </InputGroup>
      </Fragment>
    );
  }
}

export default AdvancedEditor;
