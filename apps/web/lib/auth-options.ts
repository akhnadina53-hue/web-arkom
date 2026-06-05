import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Akun Dummy Pelajar",
      credentials: {
        email: {
          label: "Email Kampus",
          type: "email",
          placeholder: "siswa@kampus.ac.id",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "bebas_apa_saja",
        },
      },
      async authorize(credentials) {
        // Dummy login: bebas masuk pakai email apa saja untuk ngetes UI
        if (credentials?.email) {
          return {
            id: "dummy-student-123",
            name: credentials.email.split("@")[0],
            email: credentials.email,
            image:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
              credentials.email,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
