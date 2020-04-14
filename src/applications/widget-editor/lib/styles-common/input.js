import styled from "styled-components"; // TODO: Move configuration to global config file.

const Input = styled.input.withConfig({
  displayName: "input__Input",
  componentId: "sc-1k6d872-0"
})(["width:100%;box-sizing:border-box;padding:14px 10px;background:#ffffff;border:1px solid rgba(202,204,208,0.85);border-radius:4px;color:#393f44;font-size:14px;&[type=\"number\"]{box-sizing:content-box;padding:8px 10px;}"]);
export default Input;