import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from 'common-hieubm';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
