import { Publisher, Subjects, TicketCreatedEvent } from 'common-hieubm';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
