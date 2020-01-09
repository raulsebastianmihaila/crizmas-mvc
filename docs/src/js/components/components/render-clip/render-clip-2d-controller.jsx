import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../../logo';
import Api from '../../api';

export default () => <div>
  <h2><Logo text="crizmas-components" /> - RenderClip2DController</h2>

  <p>Make sure you check the getting started sections <Link
  to="/components">here</Link> and <Link to ="/components/render-clip">here</Link> first.</p>

  <Api
    id="RenderClip2DController"
    text={`
      import {RenderClip2DController} from 'crizmas-components';
      // in ES5, RenderClip2DController is window.crizmas.RenderClip2DController;

      const renderClip2DController = new RenderClip2DController({
        verticalItemsCount: 1000000,
        horizontalItemsCount: 2000000,
        itemHeight: 20,
        itemWidth: 30
      });
    `} />

  <ul className="simple-list">
    <li>All the options are initially optional. They are important however when the controller
    is actually being used.</li>
    <li>It creates two controllers, one for the vertical scroll virtualization and one for
    the horizontal one. These controllers are instances of RenderClip1DController, which is very
    similar to <Link
    to="/components/render-clip/render-clip-controller">RenderClipController</Link>, they have just
    a few internal differences, but they expose the same API. Therefore if you want to use a certain
    API from these controllers you can access them directly.</li>
    <li>The constructor passes the options to the 1D controllers.</li>
    <li>In order to function properly, the controller will eventually need all the options.</li>
  </ul>

  <Api
    id="renderClip2DController.verticalRenderClipController"
    text="renderClip2DController.verticalRenderClipController" />

  <ul className="simple-list">
    <li>The vertical 1D controller.</li>
  </ul>

  <Api
    id="renderClip2DController.horizontalRenderClipController"
    text="renderClip2DController.horizontalRenderClipController" />

  <ul className="simple-list">
    <li>The horizontal 1D controller.</li>
  </ul>

  <Api
    id="renderClip2DController.setItemsCount"
    text="renderClip2DController.setItemsCount({ verticalItemsCount, horizontalItemsCount })" />

  <ul className="simple-list">
    <li>Calls the 1D controllers' setItemsCount methods, passing them the arguments.</li>
  </ul>

  <Api id="renderClip2DController.refresh" text="renderClip2DController.refresh()" />

  <ul className="simple-list">
    <li>Calls the 1D controllers' refresh methods.</li>
  </ul>

  <Api id="renderClip2DController.updateLayout" text="renderClip2DController.updateLayout()" />

  <ul className="simple-list">
    <li>If any of the 1D controllers has the `updateLayout` method, it calls it.</li>
  </ul>
</div>;
