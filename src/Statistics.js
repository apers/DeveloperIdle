import React, {Component} from "react";
import PropTypes from "prop-types";
import './App.css';

class Statistics extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }


  render() {
    const {
      state,
    } = this.props;

    const {
    } = this.state;


    const statisticsJsx = [];
    for (let key in state.actions) {
      let action = state.actions[key];

      if (action.isButton && action.isButtonDisplayed(state)) {
        statisticsJsx.push(
            <p key={action.id}>{action.scoreLabel}: {action.localStorage.value.current}</p>
        );
      }
    }

    return (
        <div className="Statistics">
          <h2>Statistics</h2>
          {statisticsJsx}
        </div>
    );
  }
}

Statistics.propTypes = {
  state: PropTypes.object,
};

Statistics.defaultProps = {
  state: {}
};

export default Statistics;
