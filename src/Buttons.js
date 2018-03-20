import React, {Component} from "react";
import PropTypes from "prop-types";
import './App.css';
import TimedButton from "./UI/TimedButton";

class Buttons extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      state,
      updateCallback,
    } = this.props;

    const {} = this.state;

    const buttonsJsx = [];
    for (let key in state) {
      let action = state[key];

      if (action.isButton && action.isButtonDisplayed(state)) {
        buttonsJsx.push(
            <TimedButton
                key={action.id}
                onClick={() => action.clickFunction(state, updateCallback)}
                disabledTime={action.disabledTime}
                title={action.title}
                id={action.id}
                disabled={!action.isButtonEnabled(state)}
                logMessage={action.logMessage}
            />
        );
      }
    }

    return (
        <div className="Buttons">
          <h2>Actions</h2>
          {buttonsJsx}
        </div>
    );
  }
}

Buttons.propTypes = {
  state: PropTypes.object,
  updateCallback: PropTypes.func,
};

Buttons.defaultProps = {
  state: {},
  updateCallback: () => {

  }
};

export default Buttons;
