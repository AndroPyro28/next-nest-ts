import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import {z} from 'zod'

const credentialsSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty()
});
async function refreshToken(token: JWT): Promise<JWT> {
  const res = await axios.get('http://localhost:3001/api/auth/refresh', {
    headers: {
      Authorization: `Refresh ${token.authTokens.refreshToken}`
    }
  })

  return {
    ...token,
    authTokens: res.data
  };

}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
          
        },  
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",

          
        },
      },
      async authorize(credentials, req):Promise<any> {
        const isFilled = credentialsSchema.safeParse(credentials)
        
        if(!isFilled.success) {
            throw new Error("Invalid Credentials");
          }

          const res = await axios.post('http://localhost:3001/api/auth/login', {
            email: credentials?.email,
            password: credentials?.password
          })
          
          if(res.status === 401){
            throw new Error("Invalid Credentials");
          }
          
          const data = res.data;
          
        return data;
      },
    }),
  ],
  callbacks: {
    // will run upon signin
    async jwt({user, token,}) {
 
      if(user) return {...token, ...user} 

      if(new Date().getTime() < token.authTokens.expiresIn) return token; // this condition means the access token is not expired yet then we return token

      return await refreshToken(token) // else we will refresh our token every time our tokens is expired
      
    },
    // will run every time getServerSession and use session use
    async session({token, session}) {
      console.log('🚀 session callback 🚀')
      session.user = token.user
      session.authTokens = token.authTokens;

      return session;
    },
  },
};

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}