import { billingCheckoutSessionState } from '@/auth/states/billingCheckoutSessionState';
import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { type OnboardingConfig } from '@/client-config/types/OnboardingConfig';
import { useIsPlanRequired } from '@/onboarding/hooks/useIsPlanRequired';
import { useOnboardingCreditRewards } from '@/onboarding/hooks/useOnboardingCreditRewards';
import { getOnboardingCreditsProgress } from '@/onboarding/utils/getOnboardingCreditsProgress';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isDefined } from 'twenty-shared/utils';

export const useOnboardingCreditsProgress = (
  onboardingConfig: OnboardingConfig,
) => {
  const creditRewards = useOnboardingCreditRewards();
  const isPlanRequired = useIsPlanRequired();
  const currentUser = useAtomStateValue(currentUserState);
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const billingCheckoutSession = useAtomStateValue(billingCheckoutSessionState);

  if (!isDefined(creditRewards) || !isDefined(currentWorkspace)) {
    return null;
  }

  return getOnboardingCreditsProgress({
    creditRewards,
    onboardingConfig,
    onboardingStatus: currentUser?.onboardingStatus,
    isFirstWorkspaceMember: currentWorkspace.workspaceMembersCount === 1,
    isPlanRequired,
    onboardingDraftCredits: {
      upgradeTrial: billingCheckoutSession.requirePaymentMethod
        ? onboardingConfig.upgradeCreditsReward
        : 0,
    },
  });
};
