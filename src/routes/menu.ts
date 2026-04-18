import { Elysia, t } from "elysia";
import { Menu } from "../models/Menu";
import { Profile } from "../models/Profile";

export const menuRoutes = new Elysia({ prefix: "/menu" })
    .get("/", async () => {
        // Feed: all available foods
        return await Menu.find({ isAvailable: true }).sort({ createdAt: -1 });
    })
    .get("/search", async ({ query }) => {
        const q = (query.q as string) || "";
        const searchRegex = new RegExp(q, "i");
        
        // Search foods
        const foods = await Menu.find({
            name: { $regex: searchRegex },
            isAvailable: true
        });

        // Search restaurants
        const restaurants = await Profile.find({
            role: "restaurant",
            $or: [
                { restaurantName: { $regex: searchRegex } },
                { displayName: { $regex: searchRegex } }
            ]
        });

        return { foods, restaurants };
    })
    .get("/restaurant/:restaurantId", async ({ params: { restaurantId } }) => {
        return await Menu.find({ restaurantId, isAvailable: true });
    })
    .post("/", async ({ body, set }) => {
        const menu = new Menu(body);
        await menu.save();
        set.status = 201;
        return menu;
    }, {
        body: t.Object({
            restaurantId: t.String(),
            name: t.String(),
            description: t.Optional(t.String()),
            price: t.Number(),
            imageUrl: t.Optional(t.String()),
            category: t.Optional(t.String())
        })
    });
