import React, { Fragment } from "react";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";

import CodeEditor from "components/code-editor";

import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";

const CODE_BLOCK_PLACEHOLDER = "// Enter custom vega configuration";

class AdvancedEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdateConfig = this.handleUpdateConfig.bind(this);
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

  render() {
    const { vegaConfig = "", invalidConfig } = this.state;
    return (
      <Fragment>
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
