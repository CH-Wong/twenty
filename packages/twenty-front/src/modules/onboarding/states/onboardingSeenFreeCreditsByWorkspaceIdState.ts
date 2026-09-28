import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export const onboardingSeenFreeCreditsByWorkspaceIdState = createAtomState<
  Record<string, number>
>({
  key: 'onboardingSeenFreeCreditsByWorkspaceIdState',
  defaultValue: {},
  useLocalStorage: true,
  localStorageOptions: { getOnInit: true },
  validateInitFn: (payload) =>
    Object.values(payload).every((credits) => Number.isFinite(credits)),
});
