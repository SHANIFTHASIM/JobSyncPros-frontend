import { cookies } from "next/headers";



const TOKEN_NAME='auth-token'
const TOKEN_REFRESH_NAME='auth-refresh-token'
const TOKEN_AGE=3600


export async function getToken(){
    const myAuthToken= await cookies().get(TOKEN_NAME)

    return myAuthToken?.value
}

export function getRefreshToken(){
    const myAuthToken= cookies().get(TOKEN_REFRESH_NAME)

    return myAuthToken?.value
}

export function setToken(authToken: string){
    
    return cookies().set({
        name:TOKEN_NAME,
        value:authToken,
        httpOnly:true,
        sameSite:'strict',
        secure:process.env.NODE_ENV !== "development",
        maxAge:TOKEN_AGE,
    })
}

export function setRefreshToken(authRefreshToken:string){
    return cookies().set({
        name:TOKEN_REFRESH_NAME,
        value:authRefreshToken,
        httpOnly:true,
        sameSite:'strict',
        secure:process.env.NODE_ENV !== "development",
        maxAge:TOKEN_AGE,
    })
}

export function deleteTokens(){
     cookies().delete(TOKEN_REFRESH_NAME)

    return cookies().delete(TOKEN_NAME)
}