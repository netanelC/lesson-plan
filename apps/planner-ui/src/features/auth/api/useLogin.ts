import { useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/axios";

// Define types locally or import from @repo/types if you added them there
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginDto) => {
      const { data: result } = await api.post<LoginResponse>(
        "/auth/login",
        data,
      );
      return result;
    },
    // No need to invalidate queries here since login is a local state change
  });
}
