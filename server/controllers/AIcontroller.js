import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;
    const { prompt, length } = req.body;

    // Double-check we have userId
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Enforce usage limit for free plan
    if (plan === "free" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Free limit reached. Upgrade to continue!"
      });
    }

    // Generate AI content
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_completion_tokens: length
    });

    const content = response.choices[0].message.content;

    // Save in your SQL table
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article');
    `;

    // Increment free_usage safely — for free users only
    if (plan === "free") {
      const freshUser = await clerkClient.users.getUser(userId);
      const currentUsage = freshUser.privateMetadata.free_usage || 0;

      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...freshUser.privateMetadata,
          free_usage: currentUsage + 1
        }
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error("Generate Article error:", error);
    res.json({ success: false, message: error.message });
  }
};
