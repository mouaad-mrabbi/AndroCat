import { RegisterUserDto } from "@/utils/dtos";
import { registerSchema } from "@/utils/validationSchemas";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { setCookie } from "@/utils/generateToken";

/**
 *  @method  POST
 *  @route   ~/api/users/register
 *  @desc    Create New User [(Register) (Sign Up)]
 *  @access  public
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterUserDto;
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const checkEmail = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (checkEmail) {
      return NextResponse.json(
        { message: "this user already registered" },
        { status: 400 }
      );
    }

    const checkUsername = await prisma.user.findUnique({
      where: { username: body.username },
    });
    if (checkUsername) {
      return NextResponse.json(
        { message: "this username already registered" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
      },
      select: {
        username: true,
        id: true,
        role: true,
      },
    });

    const cookie = setCookie({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });

    return NextResponse.json(
      { ...newUser, message: "Registered & Authenticated" },
      {
        status: 201,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
