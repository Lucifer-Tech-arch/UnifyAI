import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);

    // Determine plan
    const plan = user.privateMetadata.plan || "free";
    const isPremium = plan === "premium";

    // Attach plan and free usage to request
    req.plan = isPremium ? "premium" : "free";
    req.free_usage = isPremium ? 0 : (user.privateMetadata.free_usage || 0);
    req.user = user; // optional: attach user for convenience

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
