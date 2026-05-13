import { ReactNode } from "react";
import Link from "next/link";
import { Cog } from "lucide-react";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}

export function AuthCard({ children, title, subtitle, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#1e3a5f] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 bg-[#f59e0b] rounded-lg flex items-center justify-center">
            <Cog className="w-5 h-5 text-[#1e3a5f]" />
          </div>
          <div>
            <span className="font-bold text-lg">MD Industrial</span>
            <span className="text-blue-200 text-xs block leading-tight">
              Băng Tải - Bạc Đạn - Dây Curoa
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="px-8 pt-8 pb-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#1e3a5f] text-center">
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-500 text-sm text-center mt-1">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Card Body */}
            <div className="px-8 py-6">{children}</div>
          </div>

          {/* Footer */}
          {footer && (
            <div className="mt-4 text-center text-sm text-gray-500">
              {footer}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto text-center text-xs text-gray-400">
          © 2026 MD Industrial. Tất cả quyền được bảo lưu.
        </div>
      </footer>
    </div>
  );
}
