// middleware/auth.js
import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch user from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Safe plan handling
    let plan =
      user.privateMetadata?.plan?.toLowerCase() ||
      user.publicMetadata?.plan?.toLowerCase() ||
      "free";

    // Log if plan missing
    if (!user.privateMetadata?.plan && !user.publicMetadata?.plan) {
      console.warn(`User ${userId} has no plan set. Defaulting to Free.`);
    }

    const isPremium = plan === "premium";
    const free_usage = isPremium ? 0 : user.privateMetadata?.free_usage || 0;

    // Attach to request
    req.user = user;
    req.userId = userId;
    req.plan = plan;
    req.free_usage = free_usage;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
