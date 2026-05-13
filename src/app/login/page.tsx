"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { AuthCard } from "@/components/ui/AuthCard";
import { loginSchema, LoginInput } from "@/lib/validators/auth";
import { useAuth } from "@/hooks/useAuth";
import { ShieldCheck, UserCircle } from "lucide-react";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Đăng nhập thất bại");
        return;
      }

      const { user } = json.data;
      login(user as any);

      if (user.role === "ADMIN" || user.role === "STAFF") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch {
      setServerError("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay trở lại"
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-[#1e3a5f] font-medium hover:underline"
          >
            Đăng ký ngay
          </Link>
        </>
      }
    >
      {serverError && (
        <Alert variant="error" className="mb-5">
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username or Email */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <UserCircle className="w-5 h-5" />
          </div>
          <Input
            placeholder="Tên đăng nhập hoặc email"
            error={errors.username?.message}
            className="pl-10"
            autoComplete="username"
            {...register("username")}
          />
        </div>

        {/* Password */}
        <PasswordInput
          placeholder="Mật khẩu"
          error={errors.password?.message}
          autoComplete="current-password"
          {...register("password")}
        />

        {/* Forgot Password */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-[#1e3a5f] hover:text-[#2d5a8a] hover:underline transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Đăng nhập
        </Button>
      </form>

      {/* Security Note */}
      <div className="mt-6 pt-5 border-t border-gray-100 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">
          Thông tin đăng nhập của bạn được bảo mật bằng mã hóa SSL.
          Chúng tôi không bao giờ chia sẻ thông tin cá nhân của bạn.
        </p>
      </div>
    </AuthCard>
  );
}
