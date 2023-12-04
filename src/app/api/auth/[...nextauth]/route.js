import  NextAuth  from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
//import { Backend_URL } from '@/lib/Constants';
import { Backend_URL } from '../../../../lib/Constants';

async function refreshToken(token) {
  const res = await fetch(Backend_URL + "/auth/refresh", {
    method: 'POST',
    headers: { authorization: `Refresh ${ token.backendTokens.refreshToken }` }
  });

  const response = await res.json();

  return {
    ...token,
    backendTokens: response,
  }
}

export const authOptions = {
  secret: '123',
  providers: [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { 
              label: "Username", 
              type: "text", 
              placeholder: "you@email.com" 
          },
          password: { 
              label: "Password", 
              type: "password" 
          },
        },
        async authorize(credentials, req) {
          if(!credentials?.username || !credentials?.password) return null;
          const { username, password } = credentials;
          
          const res = await fetch(Backend_URL + "/auth/login", {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: { "Content-Type": "application/json" }
          });

          const user = await res.json()
          if(res.ok && user) {
            return user;
          }
          
          console.log(res.statusText)
          return null;
        }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({token, user}){
      if(user) return {...token, ...user}
      if(new Date().getTime() < token.backendTokens.expiresIn) return token;

      return await refreshToken(token);
    },

    async session({token, session}) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;
      return session;
    },
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };