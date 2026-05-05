import { NextRequest } from "next/server";
import { OpenAI } from "openai";
import { screensConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { and, eq } from "drizzle-orm/sql/expressions/conditions";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    function sanitizeHtmlCode(raw: string): string {
  let cleaned = raw.replace(/^```[\w]*\n?/gm, '').replace(/\n?```\s*$/gm, '');
  const firstTag = cleaned.indexOf('<');
  if (firstTag > 0) cleaned = cleaned.slice(firstTag);
  const lastTag = cleaned.lastIndexOf('>');
  if (lastTag !== -1) cleaned = cleaned.slice(0, lastTag + 1);
  return cleaned.trim();
}   
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,

    });

    
    try {
        const { projectId, screenId, oldCode, userInput } = await req.json();

        const USER_INPUT=`${oldCode} Make changes in the code keeping design and style same do as per the following instruction: ${userInput}`;

        const completion = await client.responses.create({
            model: "gpt-5.1-codex-mini",
            instructions: "You are a helpful assistant for editing existing UI code. You will be given the existing code and the user instructions on what changes they want. Make changes in the code as per the user instructions keeping the design and style same. Only return the modified code without any explanations.",
            input: USER_INPUT,
        });

        // Use output_text instead of choices[0].message.content
        const rawCode = completion.output_text;
        const cleanCode = sanitizeHtmlCode(rawCode);

        const updateResult = await db.update(screensConfigTable).set({
            code: cleanCode
        }).where(
            and(
                eq(screensConfigTable.projectId, projectId),
                eq(screensConfigTable.screenId, screenId as string)
            )
        ).returning();

        return NextResponse.json(updateResult[0]);
    } catch (error) {
        console.error("ERROR ", error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
   
    
  
