import orderModel from "../models/OrderModel.js";
import userModel from '../models/UserModel.js';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    try {
        const { items, amount, address, userId, discount } = req.body;

        // Calculate total from items
        let totalAmount = 0;
        let line_items = items.map((item) => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            };
        });

        // Add delivery charges
        const deliveryCharge = 20;
        totalAmount += deliveryCharge;
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        // Subtract discount
        if (discount > 0) {
            totalAmount -= discount;
        }

        // Final amount should not be less than 0
        totalAmount = Math.max(totalAmount, 0);

        // Create a single custom line item with final total amount
        const finalLineItems = [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Order Total",
                    },
                    unit_amount: Math.round(totalAmount * 100),
                },
                quantity: 1,
            },
        ];

        // Save order in DB
        const newOrder = new orderModel({
            userId,
            items,
            amount: totalAmount, // final amount after discount
            address,
            discount,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { Data: {} });

        const session = await stripe.checkout.sessions.create({
            line_items: finalLineItems,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
