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
import { registerSchema, RegisterInput } from "@/lib/validators/auth";
import { useAuth } from "@/hooks/useAuth";
import { UserCircle, Mail, Phone, User, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Đăng ký thất bại");
        return;
      }

      const { user } = json.data;
      login(user as any);
      router.push("/");
    } catch {
      setServerError("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Đăng ký tài khoản"
      subtitle="Tạo tài khoản để truy cập hệ thống"
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-[#1e3a5f] font-medium hover:underline"
          >
            Đăng nhập
          </Link>
        </>
      }
    >
      {serverError && (
        <Alert variant="error" className="mb-5">
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <UserCircle className="w-5 h-5" />
          </div>
          <Input
            placeholder="Tên đăng nhập"
            error={errors.username?.message}
            className="pl-10"
            autoComplete="username"
            {...register("username")}
          />
        </div>

        {/* Name */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <User className="w-5 h-5" />
          </div>
          <Input
            placeholder="Họ và tên"
            error={errors.name?.message}
            className="pl-10"
            autoComplete="name"
            {...register("name")}
          />
        </div>

        {/* Email */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Mail className="w-5 h-5" />
          </div>
          <Input
            type="email"
            placeholder="Email (tùy chọn)"
            error={errors.email?.message}
            className="pl-10"
            autoComplete="email"
            {...register("email")}
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Phone className="w-5 h-5" />
          </div>
          <Input
            type="tel"
            placeholder="Số điện thoại (tùy chọn)"
            error={errors.phone?.message}
            className="pl-10"
            autoComplete="tel"
            {...register("phone")}
          />
        </div>

        {/* Password */}
        <PasswordInput
          placeholder="Mật khẩu (ít nhất 8 ký tự)"
          error={errors.password?.message}
          autoComplete="new-password"
          {...register("password")}
        />

        {/* Confirm Password */}
        <PasswordInput
          placeholder="Xác nhận mật khẩu"
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          {...register("confirmPassword")}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Tạo tài khoản
        </Button>
      </form>

      {/* Terms Note */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">
          Bằng việc đăng ký, bạn đồng ý với{" "}
          <Link href="/terms" className="text-[#1e3a5f] hover:underline">
            Điều khoản sử dụng
          </Link>{" "}
          và{" "}
          <Link href="/privacy" className="text-[#1e3a5f] hover:underline">
            Chính sách bảo mật
          </Link>{" "}
          của MD Industrial.
        </p>
      </div>
    </AuthCard>
  );
}
