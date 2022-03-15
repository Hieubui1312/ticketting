import {Ticket} from "../ticket";
import DoneCallback = jest.DoneCallback;

it("implement optimistic concurrency control", async () => {
    const ticket = Ticket.build({
        title: "Hello",
        price: 5000,
        userId: "123"
    })
    await ticket.save();

    const firstTicket = await Ticket.findById(ticket.id);
    const secondTicket = await Ticket.findById(ticket.id);

    firstTicket!.set({price: 6000})

    await firstTicket!.save()

    secondTicket!.set({price: 7000})

    try {
        await secondTicket!.save();
    } catch (e) {
        return;
    }
    throw new Error("Not concurrent request")
})

it("increments version numbers on multiple save", async () => {
    const ticket = Ticket.build({
        title: "Hello",
        price: 5000,
        userId: "123"
    })
    await ticket.save();

    expect(ticket.version).toEqual(0)
    await ticket.save();
    expect(ticket.version).toEqual(1)
    await ticket.save();
    expect(ticket.version).toEqual(2)
})
