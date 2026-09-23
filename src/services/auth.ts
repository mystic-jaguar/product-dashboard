import { api } from "@/lib/api";

export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  accessToken: string;
};

export async function login(username: string, password: string) {
  const { data } = await api.post<User>("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });
  return data;
}
