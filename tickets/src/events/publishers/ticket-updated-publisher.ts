import { Publisher, Subjects, TicketUpdatedEvent } from 'common-hieubm';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
