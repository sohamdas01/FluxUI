
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { NEW_PROJECT_PROMPT } from "@/data/Prompt"; 
import { projectsTable, screensConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { eq,and } from "drizzle-orm/sql/expressions/conditions";
import { currentUser } from "@clerk/nextjs/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { userInput, deviceType, projectId } = await req.json();

    const completion = await client.responses.create({
      model: "gpt-5.1-codex-mini",
      instructions: NEW_PROJECT_PROMPT.replace("{deviceType}", deviceType ?? "Website"),
      input: userInput,
    });

    const raw = completion.output_text?.trim();
const cleaned = raw
  .replace(/^```[\w]*\n?/gm, '')
  .replace(/\n?```\s*$/gm, '')
  .replace(/[\u2018\u2019]/g, "'")   
  .trim();

const JSONaiResponse = JSON.parse(cleaned);
    console.log("AI RESPONSE ", JSONaiResponse);

    if (!JSONaiResponse || JSONaiResponse.error || !JSONaiResponse.projectName) {
      console.error("Invalid AI response:", JSONaiResponse);
      return NextResponse.json({ error: "AI returned invalid response" }, { status: 500 });
    }

    // Update project details
    await db.update(projectsTable).set({
      projectVisualDescription: JSONaiResponse?.projectVisualDescription,
      projectName: JSONaiResponse?.projectName,
      theme: JSONaiResponse?.theme
    }).where(eq(projectsTable.projectId, projectId));

    // Deduplicate and insert screens
    const seen = new Set<string>();
    const uniqueScreens = JSONaiResponse.screens?.filter((screen: any) => {
      if (seen.has(screen.id)) return false;
      seen.add(screen.id);
      return true;
    });

    await Promise.all(
      uniqueScreens?.map(async (screen: any) => {
        await db.insert(screensConfigTable).values({
          projectId: projectId,
          screenId: screen?.id,
          purpose: screen?.purpose,
          screenDescription: screen?.layoutDescription,
          screenName: screen?.name
        });
      }) ?? []
    );

    return NextResponse.json(JSONaiResponse);

  } catch (error) {
    console.error("ERROR ", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get('projectId');
  const screenId = req.nextUrl.searchParams.get('screenId');

  const user= await currentUser();

  if (!projectId || !screenId || !user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "Missing projectId, screenId or user" }, { status: 400 });
  }
  const result =await db.delete(screensConfigTable).where(
    and(
      eq(screensConfigTable.projectId, projectId),
      eq(screensConfigTable.screenId, screenId as string)
    )
  );
  return NextResponse.json({ msg: "Screen deleted successfully" });
}