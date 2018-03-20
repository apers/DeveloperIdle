import React, {Component} from "react";
import PropTypes from "prop-types";
import './App.css';
import TimedButton from "./UI/TimedButton";

class Upgrades extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      state,
      updateCallback,
    } = this.props;

    return null;

    const {} = this.state;

    const buttonsJsx = [];
    for (let key in state) {
      const action = state[key];

      let tooltip = action.tooltipText;
      if (!action.hasTickFunction) {
        console.log(action);
        tooltip += "<br>Produces: " + action.localStorage.value.production + " " + action.scoreLabel;
      }
      else {
        tooltip += "<br>Produces: "
            + action.localStorage.value.production
            + " " + state[action.localStorage.value.producesResources].scoreLabel
            + " every tick"
      }
      if (action.localStorage.cost.amount) {
        tooltip += "<br>Cost: " + action.localStorage.cost.amount + " " + action.localStorage.cost.name;
      }

      if (action.isButton && action.isButtonDisplayed(state)) {
        buttonsJsx.push(
            <TimedButton
                tooltip={tooltip}
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
        <div className="Upgrades">
          <h2>Upgrades</h2>
          {buttonsJsx}
        </div>
    );
  }
}

Upgrades.propTypes = {
  state: PropTypes.object,
  updateCallback: PropTypes.func,
};

Upgrades.defaultProps = {
  state: {},
  updateCallback: () => {

  }
};

export default Upgrades;
