import User from "../models/user.js";
import { videos } from "../data/videos.js";

export async function listVideos(req, res) {
  res.json({ videos });
}

export async function getMyLibrary(req, res) {
  try {
    const user = await User.findById(req.user._id).select("likedVideos savedVideos subscriptions name email");
    if (!user) return res.status(404).json({ err: "User not found" });

    res.json({
      likedVideos: user.likedVideos,
      savedVideos: user.savedVideos,
      subscriptions: user.subscriptions,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ err: "Failed to load library" });
  }
}

export async function toggleLike(req, res) {
  await toggleUserCollection(req, res, "likedVideos", "videoId");
}

export async function toggleSave(req, res) {
  await toggleUserCollection(req, res, "savedVideos", "videoId");
}

export async function toggleSubscribe(req, res) {
  await toggleUserCollection(req, res, "subscriptions", "channelId");
}

async function toggleUserCollection(req, res, fieldName, bodyKey) {
  const value = req.body[bodyKey];
  if (!value) {
    return res.status(400).json({ err: `${bodyKey} is required` });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ err: "User not found" });

    const alreadyIncluded = user[fieldName].includes(value);
    if (alreadyIncluded) {
      user[fieldName] = user[fieldName].filter((item) => item !== value);
    } else {
      user[fieldName].push(value);
    }

    await user.save();

    res.json({
      [fieldName]: user[fieldName],
      active: !alreadyIncluded
    });
  } catch (error) {
    res.status(500).json({ err: `Failed to update ${fieldName}` });
  }
}
