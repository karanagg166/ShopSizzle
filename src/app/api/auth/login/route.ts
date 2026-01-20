import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateTokens, setCookies, storeRefreshToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export const POST = async (req: Request) => {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && (await compare(password, user.password))) {
            const { accessToken, refreshToken } = generateTokens(user.id);
            await storeRefreshToken(user.id, refreshToken);
            setCookies(accessToken, refreshToken);

            return NextResponse.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }
    } catch (error) {
        console.error("Error in login:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
