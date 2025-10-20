import sql from '../config/db.js'
import { clerkClient } from "@clerk/express";

export const getUserCreations = async (req, res) => {
  try {
    const { userId, plan } = req;

    // Fetch creations
    const creationsRaw = await sql`
      SELECT * FROM creations
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    // Convert to plain objects to avoid circular JSON issues
    const creations = creationsRaw.map(c => ({ ...c }));

    return res.json({
      success: true,
      creations,
      plan,
    });
  } catch (error) {
    console.error("getUserCreations error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getpublishcreations = async(req,res) => {
    try {
        const publishcreations = await sql `SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`
        res.json({success: true, publishcreations});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export const togglelikecreations = async (req, res) => {
  try {
    const { userId } = req.auth(); 
    const { id } = req.body;

    //Fetch creation
    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;
    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }

    //Make sure likes is an array
    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();

    let updatedLikes;
    let message;

    //Correct method name: includes, not include
    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation liked";
    }

    //Format array properly for PostgreSQL
    const formattedArray = `{${updatedLikes.map((id) => `"${id}"`).join(",")}}`;

    //Update the record
    await sql`UPDATE creations SET likes = ${sql(formattedArray)}::text[] WHERE id = ${id}`;

    res.json({ success: true, message, likes: updatedLikes });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};
