import { Elysia, t } from "elysia";
import { Profile } from "../models/Profile";
import { Order } from "../models/Order";

export const profileRoutes = new Elysia({ prefix: "/profile" })
    .get("/:userId", async ({ params: { userId }, set }) => {
        const profile = await Profile.findOne({ userId });
        if (!profile) {
            set.status = 404;
            return { error: "Profile not found" };
        }
        return profile;
    })
    .get("/:userId/history", async ({ params: { userId } }) => {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        return { history: orders };
    })
    .post("/", async ({ body, set }) => {
        const profile = new Profile(body);
        await profile.save();
        set.status = 201;
        return profile;
    }, {
        body: t.Object({
            userId: t.String(),
            displayName: t.Optional(t.String()),
            phone: t.Optional(t.String()),
            role: t.Optional(t.String()),
        })
    });
