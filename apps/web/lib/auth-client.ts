import { createAuthClient } from "better-auth/react"
console.log(process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL,"url")
export const authClient = createAuthClient({
    //backend url
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL!
})