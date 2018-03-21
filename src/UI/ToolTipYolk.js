import PropTypes from "prop-types";
import React, {PureComponent} from "react";
import "./ToolTipYolk.css";

function getElementClientBoundaryStates(element) {
  const rect = element.getBoundingClientRect();

  return {
    top: (rect.top < 0 || rect.top > window.innerHeight) ? "outside" : "inside",
    bottom: (rect.bottom < 0 || rect.bottom > window.innerHeight) ? "outside" : "inside",
    left: (rect.left < 0 || rect.left > window.innerWidth) ? "outside" : "inside",
    right: (rect.right < 0 || rect.right > window.innerWidth) ? "outside" : "inside"
  };
}

class ToolTipYolk extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.updateToolTipPosition = this.updateToolTipPosition.bind(this);

    this.hoverToolTipElement = null;
  }

  componentDidMount() {
    this.updateToolTipPosition();
  }

  updateToolTipPosition() {
    if (this.hoverToolTipElement) {
      this.hoverToolTipElement.style.display = "block";

      const boundaryStates = getElementClientBoundaryStates(this.hoverToolTipElement);
      let hoverToolTipClassName = "hover-tool-tip";

      if (boundaryStates.right === "outside") {
        hoverToolTipClassName += " hover-tool-tip-left";
      }

      if (boundaryStates.bottom === "outside") {
        hoverToolTipClassName += " hover-tool-tip-up";
      }

      this.hoverToolTipElement.className = hoverToolTipClassName;
      this.hoverToolTipElement.style.display = "";
    }
  }

  render() {
    const {
      message,
      children
    } = this.props;

    const body = children || <i className="ion-help-circled"/>;

    return (
        <div className="ToolTipYolk" tabIndex="0" role="tooltip">
          {body}

          <div ref={(element) => this.hoverToolTipElement = element} className="hover-tool-tip">
            <div>{message}</div>
          </div>
        </div>
    );
  }
}

ToolTipYolk.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default ToolTipYolk;