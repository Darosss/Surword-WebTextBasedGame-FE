"use client";

import { FC, FormEvent } from "react";
import { fetchBackendApi } from "@/api/fetch";
import { useRouter } from "next/navigation";

import { User } from "@/api/types";
import { Button } from "@/components/ui/button";

type LoginResponse = User;

type LoginFetchBody = {
  email: string;
  username: string;
  password: string;
};

export const RegisterForm: FC = () => {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    if (!email || !password) return;

    await fetchBackendApi<LoginResponse, LoginFetchBody>({
      url: "auth/register",
      method: "POST",
      body: {
        email: `${email}`,
        username: `${username}`,
        password: `${password}`,
      },
      notification: { pendingText: "Trying to register. Please wait" },
    }).then((response) => {
      const data = response?.body.data;
      if (!data) return;

      router.push("login");
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-1">
      <h1 className="text-3xl font-bold mb-2 text-blue-300">Register</h1>
      <div className="w-full max-w-md p-8 bg-gray-800/50 rounded-lg shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-1 pb-4 pt-4">
          <div className="text-gray-300 mb-2 flex justify-between">
            <label className="grow max-w-1/2 text-center">Email</label>
            <input
              className="max-w-1/2 grow border rounded-sm"
              type="email"
              name="email"
              required
            />
          </div>
          <div className="text-gray-300 mb-2 flex justify-between">
            <label className="grow max-w-1/2 text-center">Username</label>
            <input
              className="max-w-1/2 grow border rounded-sm"
              type="text"
              name="username"
              required
            />
          </div>
          <div className="text-gray-300 mb-2 flex justify-between">
            <label className="grow max-w-1/2 text-center">Password</label>
            <input
              className="max-w-1/2 grow border rounded-sm"
              type="password"
              name="password"
              required
            />
          </div>
          <Button
            type="submit"
            variant="ghost"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};
