import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../../logo';
import Api from '../../api';

export default () => <div>
  <h2><Logo text="crizmas-components" /> - RenderClipController</h2>

  <p>Make sure you check the getting started sections <Link
  to="/components">here</Link> and <Link to ="/components/render-clip">here</Link> first.</p>

  <Api
    id="RenderClipController"
    text={`
      import {RenderClipController} from 'crizmas-components';
      // in ES5, RenderClipController is window.crizmas.RenderClipController;

      // vertical list without passing an items array
      const renderClipController = new RenderClipController({
        itemsCount: 1000000,
        itemHeight: 20
      });

      // horizontal list with an items array
      const renderClipController2 = new RenderClipController({
        items: Array.from({length}, (v, i) => \`item \${i}\`,
        itemWidth: 20
      });
    `} />

  <ul className="simple-list">
    <li>All the options are initially optional. They are important however when the controller
    is actually being used.</li>
    <li>In order to function properly, the controller will need one of itemsCount or items
    and one of itemWidth or itemHeight.</li>
    <li>The itemWidth must be passed for horizontal lists and itemHeight for vertical lists.</li>
    <li>The itemWidth and itemHeight can also be functions that return the size of the item,
    in case the items don't have the same size. When they are called they receive the item index
    as an argument. If an items array is passed to the controller, the size function will also
    reiceve the item for that index as the second argument. If there is a size function passed,
    an internal array for items metadata is created and for optimal performance it is recommended
    for that array to not be too big. A good length would be one million.</li>
  </ul>

  <Api id="renderClipController.setItems" text="renderClipController.setItems(items)" />

  <ul className="simple-list">
    <li>Updates the items.</li>
    <li>The items argument must be an array.</li>
    <li>Implicitly updates the items count.</li>
    <li>Peforms a refresh of the list with the new items trying to preserve the scroll
    position.</li>
    <li>It's important to set this method if the items array was changed so that the items
    count is updated accordingly. Also this can be called in order to replace the items.</li>
    <li>Once this method is called it's important not to call setItemsCount directly.</li>
  </ul>

  <Api id="renderClipController.setItemsCount" text="renderClipController.setItemsCount(count)" />

  <ul className="simple-list">
    <li>Updates the items count.</li>
    <li>Peforms a refresh of the list with the new count trying to preserve the scroll
    position.</li>
  </ul>

  <Api
    id="renderClipController.scrollIntoView"
    text="renderClipController.scrollIntoView(index, { ifNeeded, alignEnd, fit })" />

  <ul className="simple-list">
    <li>Updates the scroll position to show the item at the provided index in the viewport.</li>
    <li>The second object argument is optional.</li>
    <li>By default the item will be aligned to the start (top or left) with the viewport.</li>
    <li>If ifNeeded is true and the item is already in the view, the scroll position
    is not changed.</li>
    <li>If alignEnd is true, the item is aligned to the end (bottom or right) with the viewport.
    Buf if isNeeded is true and the item is already in the viewport the scroll position
    is not changed.</li>
    <li>fit is like ifNeeded, but if the item is not already in the viewport, if the item
    is before the viewport it will be aligned to the start and otherwise to the end
    with the viewport.</li>
  </ul>

  <Api id="renderClipController.scrollToFit" text="renderClipController.scrollToFit(index)" />

  <ul className="simple-list">
    <li>Shorthand for scrollIntoView with fit set to true.</li>
  </ul>

  <Api id="renderClipController.scrollTo" text="renderClipController.scrollTo(scrollPosition)" />

  <ul className="simple-list">
    <li>Updates the scroll position.</li>
  </ul>

  <Api id="renderClipController.refresh" text="renderClipController.refresh()" />

  <ul className="simple-list">
    <li>Recalculates the currently rendered items trying to preserve the scroll position.</li>
    <li>The RenderClip components call this when the window is resized. However this can be called
    in other cases if there is a need, for instance if some ascendant container has its
    dimensions changed without a resize event triggered on the window and without a scroll
    event triggered on the render clip component.</li>
  </ul>

  <Api id="renderClipController.updateLayout" text="renderClipController.updateLayout()" />

  <ul className="simple-list">
    <li>Only the controllers with individual item sizes have this method.</li>
    <li>Updates the items sizes while trying to preserve the scroll position.</li>
    <li>This must be called when the size of the items changes.</li>
  </ul>
</div>;
