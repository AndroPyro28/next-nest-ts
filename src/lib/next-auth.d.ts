import NextAuth from "next-auth/next";
import {JWT} from 'next-auth/jwt'


declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            email:string;
            name: string;
        },
        backendTokens: {
            accessToken: string;
            refreshToken: string;
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        user: {
            id: number;
            email:string;
            name: string;
        },
        backendTokens: {
            accessToken: string;
            refreshToken: string;
        }
    }
}