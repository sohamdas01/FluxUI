import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { screensConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { GENRATE_NEW_SCREEN_IN_EXISTING_PROJECT_PROJECT } from "@/data/Prompt";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { userInput, deviceType, projectId, oldScreenDescription, theme } = await req.json();

    const completion = await client.responses.create({
      model: "gpt-5.1-codex-mini",
      instructions: GENRATE_NEW_SCREEN_IN_EXISTING_PROJECT_PROJECT
        .replace("{deviceType}", deviceType)
        .replace("{theme}", theme),
      input: userInput + " old screen description: " + oldScreenDescription,
    });

    const JSONaiResponse = JSON.parse(completion.output_text);
    console.log("AI RESPONSE ", JSONaiResponse);

    if (!JSONaiResponse) {
      return NextResponse.json({ error: "Failed to generate screen" }, { status: 500 });
    }

    // Deduplicate by screenId before inserting
    const seen = new Set<string>();
    const uniqueScreens = JSONaiResponse.screens?.filter((screen: any) => {
      if (seen.has(screen.id)) return false;
      seen.add(screen.id);
      return true;
    });

    //  Use Promise.all + map so all inserts are properly awaited
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