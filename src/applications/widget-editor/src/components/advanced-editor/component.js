import React, { Fragment } from "react";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";

import CodeEditor from "components/code-editor";

import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";

class AdvancedEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdateConfig = this.handleUpdateConfig.bind(this);
    this.state = {
      invalidConfig: false,
      vegaConfig: JSON.stringify(
        props.editor.widget.attributes.widgetConfig,
        null,
        2
      ),
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
    const { setEditor, setWidget, editor } = this.props;
    const { vegaConfig } = this.state;

    try {
      const parseConfig = JSON.parse(vegaConfig);
      const widgetConfig = parseConfig;
      setEditor({
        widget: {
          ...editor.widget,
          attributes: {
            ...editor.widget.attributes,
            widgetConfig,
          },
        },
      });
      setWidget(widgetConfig);
      this.setState({ invalidConfig: false });
    } catch (_) {
      this.setState({ invalidConfig: true });
    }
  }, 1000);

  resolveSql(editor) {
    const url = new URL(
      editor?.widget?.attributes?.widgetConfig?.data[0]?.url || ""
    );
    return url.searchParams.get("sql");
  }

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
            onChange={(code) => this.setState({ vegaConfig: code })}
          />
        </InputGroup>
      </Fragment>
    );
  }
}

export default AdvancedEditor;
