import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { projectsTable, screensConfigTable } from "@/config/schema";
import { eq, and } from "drizzle-orm/sql/expressions/conditions";

export async function POST(req: NextRequest) {
    const { userInput, device, projectId } = await req.json();
    const user = await currentUser();

    const result = await db.insert(projectsTable).values({
        projectId: projectId,
        userId: user?.primaryEmailAddress?.emailAddress as string,
        device: device,
        userInput: userInput
    }).returning();

    return NextResponse.json(result[0] ?? {});
}

export async function GET(req: NextRequest) {
    const projectId = await req.nextUrl.searchParams.get('projectId');
    const user = await currentUser();
    //check if projectId and user email is present
    if (!projectId || !user?.primaryEmailAddress?.emailAddress) {
        return NextResponse.json(
            { error: "Missing projectId or user" },
            { status: 400 }
        );
    }
    try {
        //fetch project from db based on projectId and user email    
        const result = await db.select().from(projectsTable).where(and(eq(projectsTable.projectId, projectId), eq(projectsTable.userId, user?.primaryEmailAddress?.emailAddress as string)));
       //fetch screen config for the project
        const projectConfig = await db.select().from(screensConfigTable).where(eq(screensConfigTable.projectId, projectId as string));
        return NextResponse.json({
            projectDetail: result[0],
            screens: projectConfig
        });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }

}

