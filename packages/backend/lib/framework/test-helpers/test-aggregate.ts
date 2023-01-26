import { Aggregate } from "../aggregate-root";
import { TestCommandWithValidation, TEST_COMMAND_WITH_VALIDATION } from "./test-command-with-validation";
import { TestEvent, TEST_EVENT } from "./test-event";

export interface State {
  myId: string | null;
  eventsHandled: number;
};

export const testAggregate: Aggregate<'myId', State> = {
  identityBy: 'myId' as const,

  initState: () => ({ myId: null, eventsHandled: 0 }),

  executeMap: {
    [TEST_COMMAND_WITH_VALIDATION]: (_state: State, cmd: TestCommandWithValidation) => {
      return {
        ok: true,
        events: [new TestEvent(cmd.data)],
      }
    }
  },

  applyMap: {
    [TEST_EVENT]: (state: State, _event: TestEvent) => ({
      ...state,
      eventsHandled: state.eventsHandled + 1
    })
  }
}
