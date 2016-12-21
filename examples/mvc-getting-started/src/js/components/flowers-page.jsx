import React, {Component, PropTypes} from 'react';
import {Input} from 'crizmas-components';

export default class FlowersPage extends Component {
  constructor() {
    super();

    this.onAdd = (e) => {
      e.preventDefault();
      this.props.controller.form.submit();
    };

    this.onRandomizeAges = () => {
      this.props.controller.randomizeAges();
    };
  }

  render() {
    const {flowers, form} = this.props.controller;

    return <div>
      <button onClick={this.onRandomizeAges}>randomize ages</button>

      {flowers.items.map((flower, i) => {
        return <div key={i}
          style={flower.isAlive ? null : {textDecoration: 'line-through'}}>
          {flower.name}, {flower.daysLeft} days left
        </div>;
      })}

      <div>
        Add a new flower
        <div>
          <form>
            <div>
              <div>
                <label>name:</label>
              </div>
            </div>
            <div>
              <Input className="input" {...form.get('name')} />
            </div>
            <div>
              <label>days left:</label>
            </div>
            <div>
              <Input className="input" {...form.get('daysLeft')} type="integer" />
            </div>
            <button onClick={this.onAdd}
              disabled={form.isBlocked}>add</button>
          </form>
        </div>
      </div>
    </div>;
  }
}

FlowersPage.propTypes = {
  controller: PropTypes.object.isRequired
};
