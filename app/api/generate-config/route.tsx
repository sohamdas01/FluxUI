// import { NextRequest, NextResponse } from "next/server";
// import { openrouter } from "@/config/openrouter";
// import { App_Layout_Prompt } from "@/data/Prompt";

// xport async function POST(req:NextRequest) {
//    const {userInput,deviceType,projectId} = await req.json();

//    const aiResponse = await openrouter.chat.send({
    
//    model: "openai/gpt-5.1-codex-mini",
//    messages: [
//     {
//         role: "system",
//         content: [
//           {
//             "type": "text",
//             "text":App_Layout_Prompt.replace("{deviceType}",deviceType)
//           }
//         ]
//       },
//       {
//         "role": "user",
//         "content": [
//           {
//           "type": "text",
//           "text":userInput
//         },
//       ]
//     }
//   ],
//   stream: false
// });
// console.log(aiResponse)
// return NextResponse.json(aiResponse?.choices[0]?.message?.content);

// }


import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { App_Layout_Prompt } from "@/data/Prompt";
import { projectsTable, screensConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm/sql/expressions/conditions";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
  
    const { userInput, deviceType, projectId } = await req.json();

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: App_Layout_Prompt.replace("{deviceType}", deviceType),
        },
        {
          role: "user",
          content: userInput,
        },
      ],
    });
 
    const JSONaiResponse=JSON.parse(completion.choices[0]?.message?.content as string);
    console.log("AI RESPONSE ", JSONaiResponse);

     if(JSONaiResponse){
        // Update project details with AI response
    await db.update(projectsTable).set({
      projectVisualDescription: JSONaiResponse?.projectVisualDescription,
      projectName: JSONaiResponse?.projectName,
      theme: JSONaiResponse?.theme
    }).where(eq(projectsTable.projectId, projectId));

    // Store the generated screen config in the database
    JSONaiResponse.screens?.forEach(async (screen:any)=>{
        const result=await db.insert(screensConfigTable).values({
          projectId:projectId,
          screenId:screen?.id,
          purpose:screen?.purpose,
          screenDescription:screen?.layoutDescription,
          screenName:screen?.name
        });
      });
      return NextResponse.json(
      JSONaiResponse
    );
    }else{
        return NextResponse.json({ error: "Failed to generate config" }, { status: 500 });
    }
  } catch (error) {
    console.error("ERROR ", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}