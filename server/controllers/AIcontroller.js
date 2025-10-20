{/*--------------- Module Imports-------------- */}

import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs';
import axios from "axios";
import FormData from "form-data";
import pdf from 'pdf-parse-fork';


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

export const generateimage = async (req, res) => {
  try {
    // Extract user info
    const { userId, plan, free_usage } = req.auth();
    const { prompt, style, publish } = req.body;

    // Check authentication
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized user!" });
    }

    // Free plan limit check
    if (plan === "free" && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message: "Free limit reached. Upgrade to continue!",
      });
    }

    // Allowed styles
    const allowedStyles = [
      "Realistic",
      "Ghibli Style",
      "Anime Style",
      "Cartoon Style",
      "Fantasy Style",
      "3D Style",
      "Portrait Style",
    ];
    const selectedStyle = allowedStyles.includes(style) ? style : "Realistic";
    const finalPrompt = `Generate an image of ${prompt} in ${selectedStyle} style`;

    // Prepare form data for ClipDrop API
    const form = new FormData();
    form.append("prompt", finalPrompt);

    // Call ClipDrop API
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      form,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          ...form.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    // Convert response to base64
    const base64image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;

    // Upload to Cloudinary
    const { secure_url } = await cloudinary.uploader.upload(base64image, {
      folder: "ai_images",
    });

    // Save record to database
    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'generate-image', ${publish ?? false});
    `;

    // Update free usage in Clerk
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    // Return success
    return res.status(200).json({
      success: true,
      content: secure_url,
    });
  } catch (error) {
    console.error("Image generation failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while generating the image.",
    });
  }
};

{/* -----------------------Background removal--------------------- */}

export const backgroundremoval = async(req,res) => {
  try {
    const {userId} = req.auth();
    const image = req.file;
    const plan = req.plan;

    if(plan !== 'premium') {
      return res.json({success: false, message: "This feature is only available for premium subscriptions."})
    }
    const {secure_url} = await cloudinary.uploader.upload(image.path, {
      transformation : [
        {
          effect: 'background_removal',
        }
      ]
    })

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'remove background from string',${secure_url},'background-remove');
    `;
    return res.status(200).json({success: true, content: secure_url})

  } catch (error) {
     console.log(error);
     return res.json({success: false, message : error.message})
  }
}

{/* ------------------------Object removal------------------------- */}

export const removeobject = async(req,res) => {
  try {
    const {userId} = req.auth();
    const {object} = req.body;
    const image = req.file;
    const plan = req.plan;

    if(plan !== 'premium') {
      return res.json({success: false, message: "This feature is only available for premium subscriptions."})
    }
    const {public_id} = await cloudinary.uploader.upload(image.path);
    const imageurl = cloudinary.url(public_id, {
      transformation: [{effect: `gen_remove:${object}`}],
      resource_type: 'image',
      secure: true
    })
    const finalprompt = `Remove ${object} from image`;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId},${finalprompt},${imageurl},'remove object');
    `;
    return res.status(200).json({success: true, content: imageurl})

  } catch (error) {
     console.log(error);
     return res.json({success: false, message : error.message})
  }
}

{/* --------------Review Resume------------------ */}

export const reviewresume = async(req,res) => {
  try {
    const {userId} = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if(plan !== 'premium') {
      return res.json({success: false, message: "This feature is only available for premium subscriptions"});
    }
    if(resume.size > 5*1024*1024) {
      return res.json({sucess: false, message: "Resume size is greater then 5 mb!"});
    }
    const databuffer = fs.readFileSync(resume.path);
    const pdfdata = await pdf(databuffer);
    const prompt = `Review the following resume and provide constructive feedback on its strengths, weeknesses, and areas for improvement. Resume content: \n\n${pdfdata.text}`

    // Generate AI content
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_completion_tokens: 1000
    });
    const content = response.choices[0].message.content;
     await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId},'review the resume',${content},'review-resume');
    `;
    return res.status(200).json({success: true, content: content})

  } catch (error) {
      console.log(error);
      return res.json({success: false, message: error.message});
  }
}
