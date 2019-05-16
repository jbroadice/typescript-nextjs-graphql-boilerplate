import React from "react";
// import { FontAwesomeIcon as FAIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "react-bulma-components";

export interface FontAwesomeIconProps {
  icon: string;
}

export default class FontAwesomeIcon extends React.Component<FontAwesomeIconProps> {
  state = {
    svg: null,
  };

  // getFontSvg = async (icon) => import(`@fortawesome/free-solid-svg-icons/${icon}.js`);

  // async componentDidMount() {
  //   const svg = await this.getFontSvg(this.props.icon);
  //   this.setState({ svg: svg.definition });
  // }

  render() {
    const { svg } = this.state;
    return svg && <Icon>{/** <FAIcon icon={svg} /> */}</Icon>;
  }
}
