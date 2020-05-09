import { Configuration } from '@nuxt/types'
import { defaultsDeep } from 'lodash'

const toSnake = (str: string) => str
  .replace(/([A-Z])/g, '_$1')
  .replace(/_([A-Z])_([A-Z])_/g, '$1$2')
  .replace(/_([A-Z])_/g, '$1')
  .replace(/([\/-])_/g, '$1')
  .toLowerCase()

const extendRoutes = (routes: any[]) => {
  const new_routes = [] as any[]
  routes.forEach(v => {
    if (v.name.indexOf('-@pages') > -1) {
      v.name = toSnake(v.name.replace(/-@pages/g, ''))
      v.path = toSnake(v.path.replace(/\/@pages/g, ''))
      v.chunkName = toSnake(v.chunkName.replace(/\/@pages/g, ''))
      new_routes.push(v)
    }
  })
  return new_routes
}

export default function (config: Configuration) {

  const base = config.router?.base || '/'

  // 默认配置
  const default_config: Configuration = {
    globalName: 'site',
    dir: {
      app: 'app/app',
      assets: 'app/assets',
      layouts: 'app/layouts',
      middleware: 'app/middleware',
      store: 'app/store',
      pages: 'apps',
      static: 'static'
    },
    router: {
      base,
      extendRoutes
    },
    generate: {
      dir: 'dist' + base
    },
    buildDir: 'dist-nuxt',
    build: {
      publicPath: '/rd/',
    },
    render: {
      resourceHints: false
    },
    loaders: {
      ts: {
        silent: true
      },
      tsx: {
        silent: true
      }
    },
    loading: {
      color: '#000',
      continuous: true,
    },
    loadingIndicator: {
      name: 'wandering-cubes',
      color: '#000',
      background: '#eee'
    },
  }

  // 扩展默认配置
  defaultsDeep(config, default_config)

  return config
}