import React, {Component} from "react";
import PropTypes from "prop-types";
import './TimedButton.css';
import './Log.css';

class Log extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }


  render() {
    const {
      logMessages,
    } = this.props;

    const {
      // asd
    } = this.state;

    const logJsx = logMessages.map((message, index) => {
      return <p key={message+index} style={{opacity: 1/index}}>{message}</p>
    });

    return (
      <div className="Log">
        {logJsx}
      </div>
    );
  }
}

Log.propTypes = {
  logMessages: PropTypes.array,
};

Log.defaultProps = {
  logMessages: []
};

export default Log;
