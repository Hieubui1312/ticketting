import {Listener, OrderCreatedEvent, Subjects} from "common-hieubm";
import {queueGroupName} from "./queue-group-name";
import { Message } from 'node-nats-streaming';
import {Ticket} from "../../models/ticket";
import {TicketCreatedPublisher} from "../publishers/ticket-created-publisher";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)
        if (!ticket) {
            throw new Error("Not found ticket")
        }
        ticket.set({orderId: data.id});
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        })

        msg.ack();
    }
}
