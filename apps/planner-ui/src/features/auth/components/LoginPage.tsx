import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { type User, type Login, LoginSchema } from "@repo/types";
import { api } from "../../../lib/axios";
import { useAuth } from "../context/AuthContext";
import { TextInput } from "../../../components/ui/TextInput";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: Login) => {
    try {
      const res = await api.post<{ token: string; user: User }>(
        "/auth/login",
        data,
      );
      login(res.data.token, res.data.user);
      void navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      setError("root", {
        message: "האימייל או הסיסמה שגויים. נסה שנית.",
      });
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    try {
      // credentialResponse.credential is the JWT string from Google
      if (credentialResponse.credential == null || credentialResponse.credential === "") {
        throw new Error("No credential received from Google");
      }

      const res = await api.post<{ token: string; user: User }>(
        "/auth/google",
        {
          token: credentialResponse.credential,
        },
      );

      login(res.data.token, res.data.user);
      void navigate("/");
    } catch (error) {
      console.error("Google login failed", error);
      setError("root", { message: "ההתחברות עם גוגל נכשלה" });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      dir="rtl"
    >
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            התחברות למערכת
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ברוך שובך! הזן את פרטיך לכניסה
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput
              label="אימייל"
              type="email"
              {...register("email")}
              error={errors.email}
              autoComplete="email"
            />

            <TextInput
              label="סיסמה"
              type="password"
              {...register("password")}
              error={errors.password}
              autoComplete="current-password"
            />
          </div>

          {errors.root && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "מתחבר..." : "היכנס"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              או התחבר באמצעות
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              setError("root", { message: "שגיאה בהתחברות עם גוגל" })
            }
            useOneTap
            shape="rectangular"
            theme="outline"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};
