import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { connectDB } from "./db";
import { auth } from "./auth";
import { profileRoutes } from "./routes/profile";
import { orderRoutes } from "./routes/orders";
import { menuRoutes } from "./routes/menu";

const app = new Elysia()
    .use(cors())
    .get("/", () => "Headie Feast API is running")
    .group("/api", (app) =>
        app
            .get("/health", () => ({ status: "ok" }))
            .use(profileRoutes)
            .use(orderRoutes)
            .use(menuRoutes)
            .all("/auth/*", async (context) => {
                return auth.handler(context.request);
            })
    )
    .listen(process.env.PORT || 3001);

connectDB().then(() => {
    console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
});
