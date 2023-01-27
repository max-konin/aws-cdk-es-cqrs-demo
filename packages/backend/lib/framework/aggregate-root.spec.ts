import { v4 } from 'uuid';
import { AggregateRoot } from './aggregate-root';
import { EventStore } from './event-store';
import { State, testAggregate } from './test-helpers/test-aggregate';
import { TestCommand } from './test-helpers/test-command';
import { TestCommandWithValidation } from './test-helpers/test-command-with-validation';
import { TestEvent } from './test-helpers/test-event';

describe('Framework | Aggregate Root', () => {
  const eventStoreMock = {
    emitEvent: jest.fn().mockResolvedValue(null),
    getEvents: jest
      .fn()
      .mockResolvedValue([new TestEvent({ myId: '1' }, v4())]),
  };

  let aggregateRoot: AggregateRoot<'myId', State>;

  beforeEach(() => {
    jest.clearAllMocks();

    aggregateRoot = new AggregateRoot(testAggregate, eventStoreMock);
  });

  describe('#dispatchCommand', () => {
    const entityId = '1';
    let result: {
      ok: boolean;
      error?: string;
      aggregateState?: State;
    };

    describe('when command is supported and valid', () => {
      const expectedState = {
        myId: entityId,
        eventsHandled: 1,
      };

      beforeEach(async () => {
        const command = new TestCommandWithValidation({ myId: entityId });
        result = await aggregateRoot.dispatchCommand(command);
      });

      it('returns ok: true', () => {
        expect(result.ok).toBeTruthy();
      });

      it('returns aggregate state', () => {
        expect(result.aggregateState).toEqual(expectedState);
      });

      it('calls eventStore.emitEvent', () => {
        expect(eventStoreMock.emitEvent).toBeCalled();
      });

      it('stores the state of the new entity', () => {
        expect(aggregateRoot.findStateByIdentityField(entityId)).toEqual(
          expectedState
        );
      });
    });

    describe('unknown command', () => {
      beforeEach(async () => {
        const command = new TestCommand({ myId: entityId });
        result = await aggregateRoot.dispatchCommand(command);
      });

      it('returns ok: false', () => {
        expect(result.ok).toBeFalsy();
      });

      it('does not call eventStore.emitEvent', () => {
        expect(eventStoreMock.emitEvent).not.toBeCalled();
      });
    });
  });

  describe('#loadStatesFromEventStore', () => {
    it('applies events from the event store', async () => {
      const entityId = '1';

      await aggregateRoot.loadStatesFromEventStore(entityId);

      expect(eventStoreMock.getEvents).toHaveBeenCalledWith(entityId);
      expect(aggregateRoot.findStateByIdentityField(entityId)).toEqual({
        myId: entityId,
        eventsHandled: 1,
      });
    });
  });
});
