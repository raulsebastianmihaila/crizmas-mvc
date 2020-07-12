import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../../logo';
import Code from '../../code';

export default () => <div>
  <h2><Logo text="crizmas-components" /> - RenderClip2D</h2>

  <p>Make sure you check the getting started sections <Link
  to="/components">here</Link> and <Link to ="/components/render-clip">here</Link> first.</p>

  <p>The RenderClip2D component implements scroll virtualization on two dimensions.
  It requires an instance of RenderClip2DController,
  a renderRow function that is used to render each row and a renderCell function that
  is used to render each cell. The renderRow function receives the index of the row,
  the itemHeight and a renderCells function that it must call in order to render
  the cells in the appropriate location. Calling the renderCells function results in calling the
  renderCell function. The renderCell function receives the index of the cell, the itemWidth,
  the itemHeight and the rowIndex.</p>

  <b>
    <Code text={`
      import {RenderClip2D} from 'crizmas-components';
      // in ES5, RenderClip2D is window.crizmas.RenderClip2D;

      const letters = 'abcdefghijklmnopqrstuvwxyz';

      <RenderClip2D
        controller={renderClip2DController}
        renderRow={({index, itemHeight, renderCells}) => {
          return <div key={index} style={{height: itemHeight}}>{renderCells()}</div>;
        }}
        renderCell={({index, itemWidth, itemHeight, rowIndex}) => {
          const rowLetter = letters[rowIndex % letters.length];
          const colLetter = letters[index % letters.length];

          return <div
            key={index}
            style={{
              width: itemWidth,
              height: itemHeight,
              display: 'inline-block',
              background: index % 2 === rowIndex % 2
                ? 'blue'
                : 'green'
            }}>{rowLetter}{colLetter}</div>;
        }} />
    `} />
  </b>
</div>;
