import { time } from '..'

const config = { prefix: 'web' }

const toSnake = (str: string) =>
  str
    .replace(/([^A-Z])([A-Z])/g, '$1_$2')
    .replace(/[^A-Z0-9]+/gi, '_')
    .toLowerCase()

function id2key(id: string) {
  return config.prefix + '_' + toSnake(id)
}

export class Storage {
  setPrefix(prefix: string) {
    config.prefix = prefix || config.prefix
  }

  readonly local = new (class {
    get<T = any>(id: string) {
      try {
        const key = id2key(id)
        const dataString = localStorage.getItem(key) || '[0]'
        const [expire = 0, data] = JSON.parse(dataString)
        if (expire < 1 || expire < Date.now()) {
          this.remove(id)
          return undefined
        }
        return data as T
      } catch (e) {
        return undefined
      }
    }

    set(id: string, value: any, ms = time.oneMonth) {
      const key = id2key(id)
      const data = [Date.now() + ms, value]
      const dataString = JSON.stringify(data)
      localStorage.setItem(key, dataString)
    }

    remove(id: string) {
      const key = id2key(id)
      localStorage.removeItem(key)
    }

    clear() {
      localStorage.clear()
    }

    async warp<T>(id: string, worker: () => Promise<T>, ms?: number) {
      let result = this.get(id)

      if (result === undefined) {
        result = await worker()
        this.set(id, result, ms)
      }
      return result
    }
  })()
  readonly session = new (class {
    get<T = any>(id: string) {
      try {
        const key = id2key(id)
        const dataString = sessionStorage.getItem(key) || '[0]'
        const [expire = 0, data] = JSON.parse(dataString)
        if (expire < 1 || expire < Date.now()) {
          this.remove(id)
          return undefined
        }
        return data as T
      } catch (e) {
        return undefined
      }
    }

    set(id: string, value: any, ms = time.oneWeek) {
      const key = id2key(id)
      const data = [Date.now() + ms, value]
      const dataString = JSON.stringify(data)
      sessionStorage.setItem(key, dataString)
    }

    remove(id: string) {
      const key = id2key(id)
      sessionStorage.removeItem(key)
    }

    clear() {
      sessionStorage.clear()
    }

    async warp<T>(id: string, worker: () => Promise<T>, ms?: number) {
      let result = this.get(id)

      if (result === undefined) {
        result = await worker()
        this.set(id, result, ms)
      }
      return result
    }
  })()
}
