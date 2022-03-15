import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import mongoose from "mongoose";
import {OrderCreatedEvent, OrderStatus} from "common-hieubm";
import {Message} from "node-nats-streaming";


const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const userId = new mongoose.Types.ObjectId().toHexString();

    const ticket = await Ticket.build({
        title: "HelloWorld",
        price: 20000,
        userId
    });

    await ticket.save();

    const data: OrderCreatedEvent["data"] = {
        id: "6229d5bc78de1e4f3f4a5803",
        status: OrderStatus.Created,
        userId,
        expiresAt: new Date().toISOString(),
        version: 0,
        ticket: {
            id: ticket.id,
            price: 20000
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, ticket };
}

it("set userId of ticket", async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).toEqual(data.id)
})

it("acks the message", async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})

it("publish a ticket updated event ", async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(ticketUpdatedData.orderId).toEqual(data.id)
})
