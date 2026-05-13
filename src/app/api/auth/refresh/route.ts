import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "Refresh token not found" },
        { status: 401 }
      );
    }

    const { verifyRefreshToken } = await import("@/lib/auth");
    const payload = await verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 401 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "Tài khoản đã bị vô hiệu hóa" },
        { status: 403 }
      );
    }

    const newAccessToken = await signAccessToken({
      userId: user.id,
      email: user.email ?? "",
      role: user.role,
      name: user.name,
      username: user.username,
    });
    const newRefreshToken = await signRefreshToken({ userId: user.id });

    const cookieOptions = setAuthCookies(newAccessToken, newRefreshToken);
    const response = NextResponse.json({ success: true });

    response.cookies.set(
      cookieOptions.accessToken.name,
      cookieOptions.accessToken.value,
      cookieOptions.accessToken.options
    );
    response.cookies.set(
      cookieOptions.refreshToken.name,
      cookieOptions.refreshToken.value,
      cookieOptions.refreshToken.options
    );

    return response;
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 }
    );
  }
}
