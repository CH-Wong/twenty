import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export const onboardingCreatedWorkspaceIdsState = createAtomState<string[]>({
  key: 'onboardingCreatedWorkspaceIdsState',
  defaultValue: [],
  useLocalStorage: true,
  localStorageOptions: { getOnInit: true },
  validateInitFn: (payload) =>
    Array.isArray(payload) &&
    payload.every((workspaceId) => typeof workspaceId === 'string'),
});
