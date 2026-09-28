import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { onboardingCreatedWorkspaceIdsState } from '@/onboarding/states/onboardingCreatedWorkspaceIdsState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isDefined } from 'twenty-shared/utils';

export const useIsFirstWorkspaceMember = () => {
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const onboardingCreatedWorkspaceIds = useAtomStateValue(
    onboardingCreatedWorkspaceIdsState,
  );

  if (!isDefined(currentWorkspace)) {
    return false;
  }

  return (
    currentWorkspace.workspaceMembersCount === 1 ||
    onboardingCreatedWorkspaceIds.includes(currentWorkspace.id)
  );
};
