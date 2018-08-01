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
import Input from 'js/components/form/input';
import FormApi from 'js/components/form/api';
import RouterGettingStarted from 'js/components/router/getting-started';
import RouterTheory from 'js/components/router/theory';
import RouterApi from 'js/components/router/api';
import Tools from 'js/components/tools/tools';
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
                path: 'input-component',
                component: Input
              },
              {
                path: 'api',
                component: FormApi
              }
            ]
          },
          {
            path: 'tools',
            component: Tools
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
