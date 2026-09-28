import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { type OnboardingConfig } from '@/client-config/types/OnboardingConfig';
import { OnboardingFreeCreditsPill } from '@/onboarding/components/free-credits/OnboardingFreeCreditsPill';
import { useOnboardingCreditsProgress } from '@/onboarding/hooks/useOnboardingCreditsProgress';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isDefined } from 'twenty-shared/utils';

type OnboardingFreeCreditsProps = {
  onboardingConfig: OnboardingConfig;
};

export const OnboardingFreeCredits = ({
  onboardingConfig,
}: OnboardingFreeCreditsProps) => {
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const progress = useOnboardingCreditsProgress(onboardingConfig);

  if (
    !isDefined(currentWorkspace) ||
    !isDefined(progress) ||
    (progress.goalCredits <= 0 && progress.currentStepCredits <= 0)
  ) {
    return null;
  }

  return (
    <OnboardingFreeCreditsPill
      onboardingConfig={onboardingConfig}
      progress={progress}
      workspaceId={currentWorkspace.id}
    />
  );
};
