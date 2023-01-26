import { Command } from './command';
import { Event } from './event';
import { EventStore } from './event-store';
import { v4 } from 'uuid';

export interface CommandExecutionResult<I extends string> {
  ok: boolean;
  events?: Event<I>[];
  error?: string;
}

export interface ExecuteCmdFn<S, I extends string, C extends Command<I>>{
  (state: S, cmd: C): CommandExecutionResult<I>
}

export interface ApplyEventFn<S, I extends string, E extends Event<I>>{
  (state: S, event: E): S
}

export interface Aggregate<I extends string, S extends Record<I, string | null>> {
  initState: () => S;
  identityBy: I;
  executeMap: Record<string, ExecuteCmdFn<S, I, any>>;
  applyMap: Record<string, ApplyEventFn<S, I, any>>;
}

export interface CommandDispatchingResult<S> {
  ok: boolean;
  aggregateState?: S,
  error?: string;
}


export class AggregateRoot<I extends string, S extends Record<I, string | null>> {
  private states: S[] = [];
  constructor(private readonly aggregate: Aggregate<I, S>, private readonly eventStore: EventStore){}


  async dispatchCommand(cmd: Command<I>): Promise<CommandDispatchingResult<S>> {
    const correlationId = v4();
    const { identityBy } = this.aggregate;
    const entityId = cmd.data[identityBy];
    const state = this.findStateByIdentityField(entityId);
    const executeCommandResult = this.execute(state, cmd);

    if (!executeCommandResult.ok || !executeCommandResult.events) return executeCommandResult;

    if (!state[identityBy]) state[identityBy] = entityId as any;

    const newState = this.handleEvents(state, executeCommandResult.events);
    this.updateStates(entityId, newState);

    for (const event of executeCommandResult.events) {
      await this.eventStore.emitEvent(event, correlationId);
    }

    return {
      ...executeCommandResult,
      aggregateState: newState,
    }
  }

  findStateByIdentityField(id: string) {
    return this.states.find((s) => s[this.aggregate.identityBy] === id) ?? this.aggregate.initState();
  }

  async loadStatesFromEventStore(entityId: string) {
    const events = await this.eventStore.getEvents(entityId);
    if (events.length === 0) return;

    const initState = this.findStateByIdentityField(entityId);
    const { identityBy } = this.aggregate;

    if (!initState[identityBy]) initState[identityBy] = entityId as any;

    const state = this.handleEvents(initState, events as any);
    this.updateStates(entityId, state);
  }

  private handleEvents(state: S, events: Event<I>[]) {
    console.log(`APPLYING EVENTS`, events);
    return events.reduce((agg, event) => this.apply(agg, event), state);
  }

  private updateStates(entityId: string, newState: S) {
    const { identityBy } = this.aggregate;
    this.states = [
      ...this.states.filter(s => s[identityBy] !== entityId),
      newState,
    ]
  }


  private execute(state: S, cmd: Command<I>): CommandExecutionResult<I> {
    console.log(`DISPATCHING COMMAND ${cmd.commandName}`, cmd.data);
    const fn = this.aggregate.executeMap[cmd.commandName];

    if (!fn) return { ok: false, error: `Unknown command ${cmd.commandName}` };

    return fn(state, cmd);
  }

  private apply(state: S, event: Event<I>) {
    const fn = this.aggregate.applyMap[event.eventName];

    if (!fn) return state;

    return fn(state, event);
  }
}
