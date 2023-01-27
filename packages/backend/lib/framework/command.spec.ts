import { TestCommand } from './test-helpers/test-command';
import { TestCommandWithValidation } from './test-helpers/test-command-with-validation';

describe('Framework | Command', () => {
  describe('#isValid', () => {
    describe('when a command has validations', () => {
      it('return true if passed data are valid', () => {
        expect(
          new TestCommandWithValidation({ myId: '1' }).isValid
        ).toBeTruthy();
      });
      it('return false if passed data are not valid', () => {
        expect(new TestCommandWithValidation({} as any).isValid).toBeFalsy();
      });
    });
    describe('when a command does not have any validations', () => {
      it('return true', () => {
        expect(new TestCommand({} as any).isValid).toBeTruthy();
      });
    });
  });
  describe('#data', () => {
    it('returns validated data', () => {
      const data = { myId: '1' };
      expect(new TestCommandWithValidation(data).data).toEqual(data);
    });
  });
});
