import { TestEvent } from "./test-helpers/test-event";

describe('Framework | Event', () => {
  describe('.new', () => {
    describe('when pass an id', () => {
      it('creates a new event ', () => {
        const event = new TestEvent({ myId: '333' }, '123');
        expect(event.id).toEqual('123');
      });
    });
    describe('when w/o an id', () => {
      it('creates a new event ', () => {
        const event = new TestEvent({ myId: '333' });
        expect(event.id).toBeDefined();
      });
    });
  });
})