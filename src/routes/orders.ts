import { Elysia, t } from "elysia";
import { Order } from "../models/Order";
import { Profile } from "../models/Profile";

export const orderRoutes = new Elysia({ prefix: "/orders" })
    .get("/", async () => {
        return await Order.find().sort({ createdAt: -1 });
    })
    .get("/available", async () => {
        // Riders poll this to find orders that are "ready" to be picked up
        return await Order.find({ status: "ready" }).sort({ createdAt: -1 });
    })
    .get("/:id", async ({ params: { id }, set }) => {
        const order = await Order.findById(id);
        if (!order) {
            set.status = 404;
            return { error: "Order not found" };
        }
        
        let riderProfile = null;
        if (order.riderId) {
            riderProfile = await Profile.findOne({ userId: order.riderId });
        }
        let restaurantProfile = null;
        if (order.restaurantId) {
            restaurantProfile = await Profile.findOne({ userId: order.restaurantId });
        }

        // Return order with rider info (for phone number) and restaurant info
        return {
            ...order.toObject(),
            rider: riderProfile,
            restaurant: restaurantProfile
        };
    })
    .get("/user/:userId", async ({ params: { userId } }) => {
        return await Order.find({ userId }).sort({ createdAt: -1 });
    })
    .get("/restaurant/:restaurantId", async ({ params: { restaurantId } }) => {
        return await Order.find({ restaurantId }).sort({ createdAt: -1 });
    })
    .post("/", async ({ body, set }) => {
        const order = new Order({
            ...body,
            status: "pending"
        });
        await order.save();
        set.status = 201;
        return order;
    }, {
        body: t.Object({
            userId: t.String(),
            restaurantId: t.String(),
            items: t.Any(),
            total: t.Number(),
            deliveryLocation: t.Optional(t.Object({
                lat: t.Number(),
                lng: t.Number(),
                address: t.String()
            }))
        })
    })
    // -------------------------------------------------------------
    // Order Lifecycle Endpoints
    // -------------------------------------------------------------
    .patch("/:id/restaurant/accept", async ({ params: { id } }) => {
        return await Order.findByIdAndUpdate(id, { status: "restaurant_accepted" }, { new: true });
    })
    .patch("/:id/restaurant/ready", async ({ params: { id } }) => {
        return await Order.findByIdAndUpdate(id, { status: "ready" }, { new: true });
    })
    .patch("/:id/rider/accept", async ({ params: { id }, body }) => {
        return await Order.findByIdAndUpdate(id, { 
            status: "rider_accepted",
            riderId: body.riderId 
        }, { new: true });
    }, {
        body: t.Object({ riderId: t.String() })
    })
    .patch("/:id/rider/picked_up", async ({ params: { id } }) => {
        return await Order.findByIdAndUpdate(id, { status: "picked_up" }, { new: true });
    })
    .patch("/:id/rider/on_the_way", async ({ params: { id } }) => {
        return await Order.findByIdAndUpdate(id, { status: "on_the_way" }, { new: true });
    })
    .patch("/:id/rider/arrived", async ({ params: { id } }) => {
        return await Order.findByIdAndUpdate(id, { status: "arrived" }, { new: true });
    })
    .patch("/:id/deliver", async ({ params: { id } }) => {
        return await Order.findByIdAndUpdate(id, { status: "delivered" }, { new: true });
    })
    .patch("/:id/location", async ({ params: { id }, body }) => {
        // Endpoint for rider app to frequently push GPS coordinates (Geolocation API)
        return await Order.findByIdAndUpdate(id, { 
            driverLocation: {
                lat: body.lat,
                lng: body.lng,
                lastUpdated: new Date()
            }
        }, { new: true });
    }, {
        body: t.Object({
            lat: t.Number(),
            lng: t.Number()
        })
    });
