import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    // Clerk automatically attaches auth info via requireAuth()
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Get the latest user data from Clerk
    const user = await clerkClient.users.getUser(userId);
    const plan = user.privateMetadata.plan || "free";
    const isPremium = plan === "premium";

    // Attach to request for later use
    req.user = user;
    req.userId = userId;
    req.plan = plan;
    req.free_usage = isPremium ? 0 : (user.privateMetadata.free_usage || 0);

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
