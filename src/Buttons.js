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

    for (let key in state.actions) {
      const action = state.actions[key];

      let tooltip = action.tooltipText;
      if (!action.hasTickFunction) {
        tooltip += <br/> + "Produces: " + action.localStorage.value.production + " " + action.scoreLabel;
      }
      else {
        tooltip += <br/> + "Produces: "
            + action.localStorage.value.production
            + " " + state.actions[action.localStorage.value.producesResources].scoreLabel
            + " every tick"
      }
      if (action.localStorage.cost.amount) {
        tooltip += "<br>Cost: " + action.localStorage.cost.amount + " " + action.localStorage.cost.name;
      }

      if (action.isButton && action.isButtonDisplayed(state)) {
        buttonsJsx.push(
              <TimedButton
                  tooltip={tooltip}
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
