/* eslint-disable no-unused-vars */

declare interface Org {
  apiUrl: string;
  orgName: string;
  objectId: string;
  area: string;
  isPublic?: boolean;
}


/**
 * @see https://github.com/vitejs/vite/blob/03acecd797d8393e38c8a78f920c8e0927762018/importMeta.d.ts
 */
declare interface ImportMetaEnv {
  [key: string]: string | boolean | undefined
  BASE_URL: string
  MODE: string
  DEV: boolean
  PROD: boolean
}

/**
 * @see https://github.com/vitejs/vite/blob/03acecd797d8393e38c8a78f920c8e0927762018/importMeta.d.ts
 */
declare interface ImportMeta {
  readonly hot?: {
    readonly data: any

    accept(): void
    accept(cb: (mod: any) => void): void

    acceptDeps(dep: string, cb: (mod: any) => void): void
    acceptDeps(deps: readonly string[], cb: (mods: any[]) => void): void

    dispose(cb: (data: any) => void): void
    decline(): void
    invalidate(): void

    on(event: string, cb: (...args: any[]) => void): void
  }

  readonly env: ImportMetaEnv
}
