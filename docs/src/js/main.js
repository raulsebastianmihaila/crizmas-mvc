import Mvc from 'crizmas-mvc';
import Router from 'crizmas-router';

import Layout from 'js/components/layout';
import NotFound from 'js/components/not-found';
import Home from 'js/components/home';
import MvcGettingStarted from 'js/components/mvc/getting-started';
import MvcTheory from 'js/components/mvc/theory';
import MvcApi from 'js/components/mvc/api';
import FormGettingStarted from 'js/components/form/getting-started';
import FormTheory from 'js/components/form/theory';
import FormApi from 'js/components/form/api';
import RouterGettingStarted from 'js/components/router/getting-started';
import RouterTheory from 'js/components/router/theory';
import RouterApi from 'js/components/router/api';
import ComponentsGettingStarted from 'js/components/components/getting-started';
import Input from 'js/components/components/input';
import RenderClipGettingStarted from 'js/components/components/render-clip/getting-started';
import RenderClip from 'js/components/components/render-clip/render-clip';
import RenderClipController from 'js/components/components/render-clip/render-clip-controller';
import RenderClip2D from 'js/components/components/render-clip/render-clip-2d';
import RenderClip2DController from 'js/components/components/render-clip/render-clip-2d-controller';
import Tree from 'js/components/components/tree/tree';
import TreeController from 'js/components/components/tree/tree-controller';
import Tools from 'js/components/tools/tools';
import Applications from 'js/components/applications/applications';
import Articles from 'js/components/articles/articles';

new Mvc({
  component: Layout,
  domElement: document.querySelector('#app'),
  router: new Router({
    basePath: process.env.basePath,
    routes: [
      {
        controller: {
          onEnter({router}) {
            const path = router.url.searchParams.get('path');

            if (path) {
              router.transitionTo(`${path}${router.url.hash}`);
            }
          }
        },
        children: [
          {
            path: '*',
            component: NotFound
          },
          {
            component: Home
          },
          {
            path: 'getting-started',
            component: MvcGettingStarted
          },
          {
            path: 'theory',
            component: MvcTheory
          },
          {
            path: 'api',
            component: MvcApi
          },
          {
            path: 'router',
            children: [
              {
                component: RouterGettingStarted
              },
              {
                path: 'theory',
                component: RouterTheory
              },
              {
                path: 'api',
                component: RouterApi
              }
            ]
          },
          {
            path: 'form',
            children: [
              {
                component: FormGettingStarted
              },
              {
                path: 'theory',
                component: FormTheory
              },
              {
                path: 'api',
                component: FormApi
              }
            ]
          },
          {
            path: 'components',
            children: [
              {
                component: ComponentsGettingStarted
              },
              {
                path: 'input',
                component: Input
              },
              {
                path: 'render-clip',
                children: [
                  {
                    component: RenderClipGettingStarted
                  },
                  {
                    path: 'render-clip',
                    component: RenderClip
                  },
                  {
                    path: 'render-clip-controller',
                    component: RenderClipController
                  },
                  {
                    path: 'render-clip-2d',
                    component: RenderClip2D
                  },
                  {
                    path: 'render-clip-2d-controller',
                    component: RenderClip2DController
                  }
                ]
              },
              {
                path: 'tree',
                children: [
                  Router.fallbackRoute({path: '', to: '/components/tree/tree', replace: true}),
                  {
                    path: 'tree',
                    component: Tree
                  },
                  {
                    path: 'tree-controller',
                    component: TreeController
                  }
                ]
              }
            ]
          },
          {
            path: 'tools',
            component: Tools
          },
          {
            path: 'applications',
            component: Applications
          },
          {
            path: 'articles',
            component: Articles
          }
        ]
      }
    ]
  })
});
