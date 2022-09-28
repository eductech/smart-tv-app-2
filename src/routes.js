import { Router } from '@lightningjs/sdk'

import { Splash } from './Splash'
import { Home } from './Home'
import { Detail } from './Detail'
import { getInitData, getHomePageData, getDetailPageData } from './api'

const routes = {
  root: 'home',
  boot: () => {
    return getInitData(Router.resume)
  },
  routes: [
    {
      path: '$',
      component: Splash,
    },
    {
      path: 'home',
      component: Home,
      before: getHomePageData,
    },
    {
      path: 'detail/:id',
      component: Detail,
      before: getDetailPageData,
      options: {
        reuseInstance: false,
      },
      // preventStorage: true,
    },
  ],
}

export { routes }
