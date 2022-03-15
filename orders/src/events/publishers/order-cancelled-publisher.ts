import { Subjects, Publisher, OrderCancelledEvent } from 'common-hieubm';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
