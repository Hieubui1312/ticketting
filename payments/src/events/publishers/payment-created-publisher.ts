import { Subjects, Publisher, PaymentCreatedEvent } from 'common-hieubm';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
