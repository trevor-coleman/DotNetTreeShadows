import { useTypedSelector } from "../index";

export const useRegisterRejectedMessage: () => string | null = () => useTypedSelector(
    state => state.auth.registerRejectedMessage);

export const useSignInRejectedMessage: () => string | null = () => useTypedSelector(
    state => state.auth.signInRejectedMessage);

export const useCheckUsernameForDuplicates: () => { pending: boolean, result: boolean, message: string } = () => useTypedSelector(
    state => ({
        pending: state.auth.checkIfDuplicatePending,
        result: state.auth.checkIfDuplicateResult,
        message: state.auth.checkIfDuplicateMessage,
      }));
