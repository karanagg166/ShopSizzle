import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTokens, setCookies, storeRefreshToken, hashPassword } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
    try {
        const { name, email, password } = await req.json();

        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                cartItems: {
                    create: [],
                },
            },
        });

        const { accessToken, refreshToken } = generateTokens(user.id);
        await storeRefreshToken(user.id, refreshToken);

        setCookies(accessToken, refreshToken);

        return NextResponse.json(
            {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in signup:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
