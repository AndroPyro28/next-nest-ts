import { mutate, query } from "@/hooks/useQueryProcessor";
import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {z} from 'zod'

const credentialsSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty()
});

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
        // const login = mutate<credentialsType>('/auth/login','POST',['login'], {});
        
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
          
          const user = res.data;
          
        return user;
      },
    }),
  ],
  callbacks: {
    // will run upon signin
    async jwt({user, token}) {

      if(user) return {...token, ...user} 

      return token;
    },
    // will run every time getServerSession and use session use
    async session({token, session}) {
      session.user = token.user
      session.backendTokens = token.backendTokens;

      return session;
    },
  }
};

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}