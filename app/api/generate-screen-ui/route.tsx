// import { NextRequest, NextResponse } from 'next/server';
// import OpenAI from "openai";
// import { GENERATION_SCREEN_PROMPT } from "@/data/Prompt";
// import { projectsTable, screensConfigTable } from "@/config/schema";
// import { db } from "@/config/db";
// import { and, eq } from "drizzle-orm/sql/expressions/conditions";
// export async function POST(req: NextRequest) {
//  try{
//   const { projectId, screenId, screenName, purpose, screenDescription,
//     theme, device, projectVisualDescription } = await req.json();

//   const userInput = `
//    Device Type: ${device ?? 'Website'}
//    Theme: ${theme ?? 'ARCTIC_BREEZE'}
//   Project Visual Style: ${projectVisualDescription ?? ''}

//   Screen Name: ${screenName}
//   Screen Purpose: ${purpose}
//   Screen Description: ${screenDescription}
//   `;
//  const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

//   const completion = await client.chat.completions.create({
//     model: "gpt-5.1-codex-mini",
//     messages: [
//       {
//         role: "system",
//         content: GENERATION_SCREEN_PROMPT,
//       },
//       {
//         role: "user",
//         content: userInput,
//       },
//     ],
//   });

//   //  const updateResult=await db.update(screensConfigTable).set({
//   //   code:completion?.choices[0]?.message?.content as string
//   //  }).where(and(eq(screensConfigTable.projectId, projectId),eq(screensConfigTable.screenId, screenId as string))).returning();

//  function sanitizeHtmlCode(raw: string): string {
//   // Remove any markdown code fences (```html, ```tsx, ``` etc.)
//   let cleaned = raw.replace(/^```[\w]*\n?/gm, '').replace(/\n?```\s*$/gm, '');

//   // Find the first < character (start of actual HTML) and slice from there
//   const firstTag = cleaned.indexOf('<');
//   if (firstTag > 0) {
//     cleaned = cleaned.slice(firstTag);
//   }

//   // Remove everything after the last closing tag
//   const lastTag = cleaned.lastIndexOf('>');
//   if (lastTag !== -1) {
//     cleaned = cleaned.slice(0, lastTag + 1);
//   }

//   return cleaned.trim();
// }
//   const rawCode = completion?.choices[0]?.message?.content as string;
//   const cleanCode = sanitizeHtmlCode(rawCode);
//   const updateResult = await db.update(screensConfigTable).set({
//     code: cleanCode
//   }).where(and(eq(screensConfigTable.projectId, projectId), eq(screensConfigTable.screenId, screenId as string))).returning();

//   return NextResponse.json(updateResult[0]);
// } catch (error) {
//   return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
// }
// }
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import { GENERATION_SCREEN_PROMPT } from "@/data/Prompt";
import { screensConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { and, eq } from "drizzle-orm/sql/expressions/conditions";
import { currentUser } from '@clerk/nextjs/server';

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

export async function POST(req: NextRequest) {
  try {
    const { projectId, screenId, screenName, purpose, screenDescription,
      theme, device, projectVisualDescription } = await req.json();

    const userInput = `
Device Type: ${device ?? 'Website'}
Theme: ${theme ?? 'ARCTIC_BREEZE'}
Project Visual Style: ${projectVisualDescription ?? ''}

Screen Name: ${screenName}
Screen Purpose: ${purpose}
Screen Description: ${screenDescription}
    `;

    // ✅ Use responses.create() for gpt-5.1-codex-mini
    const completion = await client.responses.create({
      model: "gpt-5.1-codex-mini",
      instructions: GENERATION_SCREEN_PROMPT,
      input: userInput,
    });

    // ✅ Use output_text instead of choices[0].message.content
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

