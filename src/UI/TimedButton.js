import React, {Component} from "react";
import PropTypes from "prop-types";
import './TimedButton.css';
import App from "../App";
import Popover from 'react-simple-popover';

class TimedButton extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      percentage: 100,
    };

    if (props.disabledTime !== 0) {
      this.state = {
        percentage: 100,
      };

      setInterval(() => {
        if (this.state.percentage <= 0) {
          this.setState({
            percentage: 0,
          })
        }
        else {
          this.setState({
            percentage: this.state.percentage - (100 / (props.disabledTime / App.getTickTime()) / 1000),
          })
        }
      }, App.getTickTime());
    }
    else {
      this.state = {
        percentage: 0,
      };
    }
  }

  handleClick() {
    const {
      onClick,
      id,
      logMessage,
    } = this.props;

    if (this.props.disabledTime !== 0) {
      this.setState({
        percentage: 100,
      });
    }
    else {
      this.setState({
        percentage: 0,
      });
    }

    onClick(id, logMessage);
  }

  render() {
    const {
      title,
      disabled,
      tooltip,
    } = this.props;

    const {
      percentage,
    } = this.state;

    let style = {
      background: "-webkit-linear-gradient(left, #c3c4c9 " + percentage + "%, rgba(255, 0, 0, 0) " + percentage + "%)",
    };

    const className = ["TimedButton"];

    let buttonDisabled = percentage !== 0;
    buttonDisabled = buttonDisabled || disabled;
    if (buttonDisabled) {
      className.push("disabled");
    }

    return (
        <div data-tip={tooltip}>
          <Popover
              placement="right"
              container={this}
              target={this.refs.target}
              show={this.state.showPopover}
          >
          </Popover>
          <button
              onMouseEnter={() => {
                this.setState({
                  showPopover: true,
                })
              }}
              onMouseLeave={() => {
                this.setState({
                  showPopover: false,
                })
              }}
              disabled={buttonDisabled}
              style={style}
              className={className.join(" ")}
              onClick={this.handleClick}
          >
            <div className="title">{title}</div>
          </button>
        </div>
    );
  }
}

TimedButton.propTypes = {
  title: PropTypes.string.isRequired,
  disabledTime: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  logMessage: PropTypes.string,
  disabled: PropTypes.bool,
  tooltip: PropTypes.string,
};

TimedButton.defaultProps = {
  disabledTime: 5,
  onClick: () => {
  },
  logMessage: "",
  disabled: false,
  tooltip: null,
};

export default TimedButton;
