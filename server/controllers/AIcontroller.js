{/*--------------- Module Imports-------------- */}

import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";
import { ImageClient } from "@google/generative-ai";
import {v2 as cloudinary} from 'cloudinary'
import { GoogleGenAI, PersonGeneration } from "@google/genai";

{/*------------------- API Initialization---------------- */}

const AI = new OpenAI({
  apiKey: process.env.GEMINI_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

{/*--------------------- Generate Article Controller--------------------- */}

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

{/*---------------------Generate blog title controller------------------------ */}

export const generateblogtitle = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;
    const { prompt, category } = req.body;

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
    const allowedcateogary = ['General', 'Technology', 'Buisness', 'Health', 'LifeStyle', 'Education', 'Travel', 'Food'];
    const selectedcategory = allowedcateogary.includes(category) ? category : 'General';
    const finalprompt = `Generate a cachy blog title about ${prompt} in ${selectedcategory}`
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: finalprompt }],
      temperature: 0.7,
      max_completion_tokens: 100
    });
    const content = response.choices[0].message.content;

    // Save in your SQL table
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title');
    `;
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      })
    }
    return res.json({ success: true, content });
  } catch (error) {
    console.log(error);
    return res.json({ sucess: false, message: error.message });
  }
}

{/* ---------------Generate Image-------------------- */}

export const generateImage = async (req, res) => {
  try {
    // ✅ Extract user info
    const { userId, plan, free_usage } = req.auth();
    const { prompt, style, publish } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized user!" });
    }

    if (plan === "free" && free_usage >= 10) {
      return res.status(403).json({ success: false, message: "Free limit reached. Upgrade to continue!" });
    }

    // ✅ Allowed styles
    const allowedStyles = ["Realistic", "Ghibli Style", "Anime Style", "Cartoon Style", "Fantasy Style", "3D Style", "Portrait Style"];
    const selectedStyle = allowedStyles.includes(style) ? style : "Realistic";
    const finalPrompt = `Generate an image of ${prompt} in ${selectedStyle} style`;

    // ✅ Initialize Google Gemini / GenAI
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // ✅ Generate image
    const response = await ai.models.generateImages({
      model: "models/imagen-4.0-generate-001", // Make sure this is enabled in your project
      prompt: finalPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        personGeneration: PersonGeneration.ALLOW_ALL,
        aspectRatio: "1:1",
        imageSize: "1K",
      },
    });

    if (!response?.generatedImages || response.generatedImages.length === 0) {
      return res.status(500).json({ success: false, message: "No image generated." });
    }

    const imageBase64 = response.generatedImages[0]?.image?.imageBytes;
    if (!imageBase64) {
      return res.status(500).json({ success: false, message: "Image bytes missing from response." });
    }

    // ✅ Upload base64 image directly to Cloudinary
    const { secure_url } = await cloudinary.uploader.upload(`data:image/jpeg;base64,${imageBase64}`, {
      folder: "ai_images",
    });

    // ✅ Save record in database
    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'generate-image', ${publish ?? false});
    `;

    // ✅ Update free usage
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    return res.status(200).json({ success: true, content: secure_url });
  } catch (error) {
    console.error("❌ Gemini image generation failed:", error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong while generating the image." });
  }
};