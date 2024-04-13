import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'รหัสพนักงาน',
        },
        pwd: { label: 'Password', type: 'password' },
      },

      async authorize(credentials, req) {
        //console.log(credentials);
        try {
          const response = await axios.post(process.env.PWA_API, credentials);

          if (response.data.status == 'success') {
            const user = response.data;
            //console.log(user);
            return user;
          } else {
            return null;
          }
        } catch (error) {
          throw new Error('Failed to authenticate');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        user && (token.user = user);
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user = token.user;
      }
      return session;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
