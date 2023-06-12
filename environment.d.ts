declare namespace NodeJS {
    export interface ProcessEnv {
        readonly NEXT_PUBLIC_API_URL: string
        readonly NEXT_PUBLIC_API_KEY: string
        readonly NEXT_PUBLIC_APP_ENV: string
    }
}
