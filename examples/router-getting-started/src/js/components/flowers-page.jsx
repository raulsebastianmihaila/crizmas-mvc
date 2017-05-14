import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'crizmas-router';

class FlowersPage extends Component {
  constructor() {
    super();

    this.click = () => {
      this.props.controller.increaseCount();
    };
  }

  render() {
    return <div>
      <h2>This is the flowers page</h2>
      <div>
        <button onClick={this.click}>Click to increase the flowers count</button>
        <div>Flowers count: {this.props.controller.count}</div>
      </div>
      <div>Go to the <Link to="/home">home</Link> page.</div>
    </div>;
  }
}

FlowersPage.propTypes = {
  controller: PropTypes.object.isRequired
};

export default FlowersPage;
