import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { type User, type Register, RegisterSchema } from "@repo/types";
import { toast } from "react-hot-toast";
import { api, extractApiError } from "../../../lib/axios";
import { useAuth } from "../context/AuthContext";
import { TextInput } from "../../../components/ui/TextInput";

export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: Register) => {
    try {
      const res = await api.post<{ token: string; user: User }>(
        "/auth/register",
        data,
      );
      login(res.data.token, res.data.user);
      void navigate("/");
    } catch (error) {
      const message = extractApiError(error);
      toast.error(message);
      setError("root", {
        message,
      });
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    try {
      if (
        credentialResponse.credential == null ||
        credentialResponse.credential === ""
      ) {
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
      const message = extractApiError(error);
      toast.error("הרשמה עם גוגל נכשלה");
      setError("root", { message });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      dir="rtl"
    >
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg my-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            יצירת משתמש חדש
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            הירשם כדי להתחיל ליצור ולצפות במערכי שיעור
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput
              label="שם מלא"
              type="text"
              {...register("fullName")}
              error={errors.fullName}
              autoComplete="name"
            />

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
              autoComplete="new-password"
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
            {isSubmitting ? "יוצר משתמש..." : "הרשמה למערכת"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            כבר יש לך חשבון? התחבר כאן
          </Link>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              או הירשם באמצעות
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              setError("root", { message: "שגיאה בהרשמה עם גוגל" })
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
