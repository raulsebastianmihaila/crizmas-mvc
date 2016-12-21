import React from 'react';

import controller from 'js/controllers/home-controller';

export default class extends React.Component {
  render() {
    const {obj1, obj2, obj3, obj4} = controller;

    return <div>
      <div>
        obj 1 {String(obj1.isPending)}
        <button onClick={() => obj1.func()}>obj1.func()</button>
      </div>
      <div>
        obj 2 {String(obj2.isPending)}
        <button onClick={() => obj2.func()}>obj2.func()</button>
      </div>
      <div>obj 3 {String(obj3.isPending)}</div>
      <div>obj 4 {String(obj4.isPending)}</div>
    </div>;
  }
}
