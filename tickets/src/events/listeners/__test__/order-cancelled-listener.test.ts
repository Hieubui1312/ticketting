import {Ticket} from "../../../models/ticket";
import mongoose from "mongoose";
import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {OrderCancelledEvent} from "common-hieubm"
import {OrderCancelledListener} from "../order-cancelled-listener";


const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const userId = new mongoose.Types.ObjectId().toHexString();
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = await Ticket.build({
        title: "HelloWorld",
        price: 20000,
        userId
    })
    ticket.set({orderId: orderId})
    await ticket.save();

    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 1,
        ticket: {
            id: ticket.id
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, ticket };
}

it("Update order id is undefined, publish update ticket message, msg ack have been called", async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket?.orderId).not.toBeDefined();

    expect(natsWrapper.client.publish).toBeCalled();
    expect(msg.ack).toBeCalled();
})
