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

    const {} = this.state;

    const buttonsJsx = [];
    for (let key in state.upgrades) {
      const upgrade = state.upgrades[key];

      let tooltip = upgrade.tooltipText;

      if (upgrade.isButtonDisplayed(state, updateCallback) && !upgrade.isUpgradeActive(state)) {
        buttonsJsx.push(
            <TimedButton
                tooltip={tooltip}
                key={upgrade.id}
                onClick={() => upgrade.clickFunction(state, updateCallback)}
                title={upgrade.title}
                id={upgrade.id}
                disabledTime={0}
                disabled={!upgrade.isButtonEnabled(state)}
                logMessage={upgrade.logMessage}
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
