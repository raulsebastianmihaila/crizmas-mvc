import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../../logo';
import Code from '../../code';

export default () => <div>
  <h2><Logo text="crizmas-components" /> - RenderClip</h2>

  <p>Make sure you check the getting started sections <Link
  to="/components">here</Link> and <Link to ="/components/render-clip">here</Link> first.</p>

  <p>The RenderClip component requires an instance of RenderClipController
  and a renderItem function that is used to render each item. The renderItem
  function receives the itemHeight or itemWidth depending on how the
  controller was created. It also receives the item index. If the
  controller received a list of items, the renderItem function will also
  receive the item.</p>

  <p>By default a row occupies only as much space as required by the content/styling of that row.
  This helps in case the content exceeds the space available for that content,
  in which case a scrollbar would be displayed. There are also cases when the content of a row
  occupies less space than the space that is available for that row. In such cases it might be
  desired that the row stretches so that it occupies the entire space available.
  For instance, if the row has a flex display. In this case the stretch prop can be set to true in
  order to achieve this.</p>

  <b>
    <Code text={`
      import {RenderClip} from 'crizmas-components';
      // in ES5, RenderClip is window.crizmas.RenderClip;

      // in these examples we're rendering a list of strings.

      const itemsArray = Array.from({length}, (v, i) => \`item \${i}\`;

      // vertical list
      <RenderClip
        controller={renderClipController}
        renderItem={({index, itemHeight}) => {
          return <div key={index} style={{height: itemHeight}}>{itemsArray[index]}</div>;
        }} />

      // if items are passed
      <RenderClip
        controller={renderClipController}
        renderItem={({index, item, itemHeight}) => {
          return <div key={index} style={{height: itemHeight}}>{item}</div>;
        }} />

      // vertical list in which the rows are stretched in order to occupy the available space
      <RenderClip
        controller={renderClipController}
        stretch
        renderItem={({index, itemHeight}) => {
          return <div key={index} style={{height: itemHeight}}>{itemsArray[index]}</div>;
        }} />

      // horizontal list
      <RenderClip
        controller={renderClipController}
        renderItem={({index, itemWidth, item}) => {
          return <div key={index} style={{
            width: itemWidth,
            display: 'inline-block',
            writingMode: 'vertical-lr',
            textOrientation: 'upright',
            verticalAlign: 'top'
          }}>{item}</div>;
        }} />
    `} />
  </b>
</div>;
