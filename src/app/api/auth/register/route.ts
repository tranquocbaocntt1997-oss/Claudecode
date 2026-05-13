import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validators/auth";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = validation.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email đã được sử dụng" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone ?? null,
        role: "CUSTOMER",
      },
    });

    const accessToken = await signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    const refreshToken = await signRefreshToken({ userId: user.id });

    const cookieOptions = setAuthCookies(accessToken, refreshToken);
    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      },
      { status: 201 }
    );

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
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 }
    );
  }
}
