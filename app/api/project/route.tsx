import { NextRequest,NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {projectsTable} from "@/config/schema";
export async function POST(req:NextRequest){
    const{userInput,device,projectId}=await req.json();
    const user=await currentUser();

    const result=await db.insert(projectsTable).values({
        projectId:projectId,
        userId:user?.primaryEmailAddress?.emailAddress as string,
        device:device,
        userInput:userInput
    }).returning();

    return NextResponse.json(result[0]??{});
}
