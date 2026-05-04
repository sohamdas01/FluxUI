

// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";
// import { App_Layout_Prompt } from "@/data/Prompt";
// import { projectsTable, screensConfigTable } from "@/config/schema";
// import { db } from "@/config/db";
// import { eq } from "drizzle-orm/sql/expressions/conditions";

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: NextRequest) {
//   try {
      
//     const { userInput, deviceType, projectId } = await req.json();

//     const completion = await client.chat.completions.create({
//       model: "gpt-4.1",
//       messages: [
//         {
//           role: "system",
//           content: App_Layout_Prompt.replace("{deviceType}", deviceType),
//         },
//         {
//           role: "user",
//           content: userInput,
//         },
//       ],
//     });

//     const JSONaiResponse = JSON.parse(completion.choices[0]?.message?.content as string);
//     console.log("AI RESPONSE ", JSONaiResponse);

//     if (JSONaiResponse) {
//       // Update project details with AI response
//       await db.update(projectsTable).set({
//         projectVisualDescription: JSONaiResponse?.projectVisualDescription,
//         projectName: JSONaiResponse?.projectName,
//         theme: JSONaiResponse?.theme
//       }).where(eq(projectsTable.projectId, projectId));

//       const seen = new Set<string>();
//       const uniqueScreens = JSONaiResponse.screens?.filter((screen: any) => {
//         if (seen.has(screen.id)) return false;
//         seen.add(screen.id);
//         return true;
//       });

//       uniqueScreens?.forEach(async (screen: any) => {
//         await db.insert(screensConfigTable).values({
//           projectId: projectId,
//           screenId: screen?.id,
//           purpose: screen?.purpose,
//           screenDescription: screen?.layoutDescription,
//           screenName: screen?.name
//         });
//       });
//       return NextResponse.json(
//         JSONaiResponse
//       );
//     } else {
//       return NextResponse.json({ error: "Failed to generate config" }, { status: 500 });
//     }
//   } catch (error) {
//     console.error("ERROR ", error);
//     return NextResponse.json({ error: "Failed" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { App_Layout_Prompt } from "@/data/Prompt";
import { projectsTable, screensConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { eq,and } from "drizzle-orm/sql/expressions/conditions";
import { currentUser } from '@clerk/nextjs/server';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { userInput, deviceType, projectId } = await req.json();

    // ✅ Use responses.create() for gpt-5.1-codex-mini
    const completion = await client.responses.create({
      model: "gpt-5.1-codex-mini",
      instructions: App_Layout_Prompt.replace("{deviceType}", deviceType),
      input: userInput,
    });

    // ✅ Use output_text instead of choices[0].message.content
    const JSONaiResponse = JSON.parse(completion.output_text);
    console.log("AI RESPONSE ", JSONaiResponse);

  // if (!JSONaiResponse || JSONaiResponse.error || !JSONaiResponse.projectName) {
  // console.error("Invalid AI response:", JSONaiResponse);
  // return NextResponse.json({ error: "AI returned invalid response" }, { status: 500 });
  // }

    if (JSONaiResponse) {
      await db.update(projectsTable).set({
        projectVisualDescription: JSONaiResponse?.projectVisualDescription,
        projectName: JSONaiResponse?.projectName,
        theme: JSONaiResponse?.theme
      }).where(eq(projectsTable.projectId, projectId));

      const seen = new Set<string>();
      const uniqueScreens = JSONaiResponse.screens?.filter((screen: any) => {
        if (seen.has(screen.id)) return false;
        seen.add(screen.id);
        return true;
      });

      uniqueScreens?.forEach(async (screen: any) => {
        await db.insert(screensConfigTable).values({
          projectId: projectId,
          screenId: screen?.id,
          purpose: screen?.purpose,
          screenDescription: screen?.layoutDescription,
          screenName: screen?.name
        });
      });

      return NextResponse.json(JSONaiResponse);
    } else {
      return NextResponse.json({ error: "Failed to generate config" }, { status: 500 });
    }
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