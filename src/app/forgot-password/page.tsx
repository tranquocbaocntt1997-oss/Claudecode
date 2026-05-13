"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { AuthCard } from "@/components/ui/AuthCard";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validators/auth";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setServerError(null);
    setServerMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Có lỗi xảy ra");
        return;
      }

      setServerMessage(json.message);
    } catch {
      setServerError("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Quên mật khẩu"
      subtitle="Nhập email để nhận link đặt lại mật khẩu"
      footer={
        <>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-[#1e3a5f] font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay về đăng nhập
          </Link>
        </>
      }
    >
      {/* Success */}
      {serverMessage && (
        <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-800 font-medium">
                Gửi yêu cầu thành công!
              </p>
              <p className="text-sm text-green-700 mt-1">{serverMessage}</p>
              <p className="text-xs text-green-600 mt-2">
                Kiểm tra console dev server để xem token reset (mock mode).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {serverError && (
        <Alert variant="error" className="mb-5">
          {serverError}
        </Alert>
      )}

      {/* Form */}
      {!serverMessage && (
        <>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Nếu email của bạn tồn tại trong hệ thống, chúng tôi sẽ gửi một
            link đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
                error={errors.email?.message}
                className="pl-10"
                autoComplete="email"
                {...register("email")}
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Gửi link đặt lại
            </Button>
          </form>
        </>
      )}

      {/* Back Link */}
      {serverMessage && (
        <div className="mt-5">
          <Link
            href="/login"
            className="block w-full text-center text-sm text-[#1e3a5f] font-medium hover:underline py-2.5 border border-[#1e3a5f] rounded-lg hover:bg-gray-50 transition-colors"
          >
            Quay về đăng nhập
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
