import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validators/auth";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "Tài khoản đã bị vô hiệu hóa" },
        { status: 403 }
      );
    }

    const accessToken = await signAccessToken({
      userId: user.id,
      email: user.email ?? "",
      role: user.role,
      name: user.name,
      username: user.username,
    });
    const refreshToken = await signRefreshToken({ userId: user.id });

    const cookieOptions = setAuthCookies(accessToken, refreshToken);
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          userId: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
        },
      },
    });

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
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 }
    );
  }
}
