import { currentUserState } from '@/auth/states/currentUserState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const useIsFirstWorkspaceMember = () => {
  const currentUser = useAtomStateValue(currentUserState);

  return currentUser?.isWorkspaceCreator === true;
};
