import React, {Component, PropTypes} from 'react';
import {Input} from 'crizmas-components';

export default class FlowersPage extends Component {
  constructor() {
    super();

    this.onAdd = (e) => {
      e.preventDefault();
      this.props.controller.form.submit();
    };
  }

  render() {
    const {flowers, form} = this.props.controller;

    return <div>
      {flowers.items.map((flower, i) => {
        return <div key={i}>
          {flower.name}, {flower.color}
        </div>;
      })}

      <div>
        Add a new flower
        <div>
          <form>
            <div>
              <label>name:</label>
            </div>
            <div>
              <Input className="input" {...form.get('name')} />
            </div>
            <div>
              <label>color:</label>
            </div>
            <div>
              <Input className="input" {...form.get('color')} />
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
