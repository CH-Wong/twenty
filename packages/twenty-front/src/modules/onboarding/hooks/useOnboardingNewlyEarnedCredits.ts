import { onboardingSeenFreeCreditsByWorkspaceIdState } from '@/onboarding/states/onboardingSeenFreeCreditsByWorkspaceIdState';
import { type OnboardingCreditsProgress } from '@/onboarding/types/OnboardingCreditsProgress';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useState } from 'react';

type UseOnboardingNewlyEarnedCreditsArgs = {
  progress: OnboardingCreditsProgress;
  workspaceId: string;
};

export const useOnboardingNewlyEarnedCredits = ({
  progress,
  workspaceId,
}: UseOnboardingNewlyEarnedCreditsArgs) => {
  const [
    onboardingSeenFreeCreditsByWorkspaceId,
    setOnboardingSeenFreeCreditsByWorkspaceId,
  ] = useAtomState(onboardingSeenFreeCreditsByWorkspaceIdState);
  const [celebratedCredits, setCelebratedCredits] = useState<number | null>(
    null,
  );

  const trialCredits =
    progress.earnedCreditsBySource.find(
      ({ source }) => source === 'upgradeTrial',
    )?.credits ?? 0;
  const earnedCreditsWithoutTrial = progress.earnedCredits - trialCredits;

  const persistedSeenCredits =
    onboardingSeenFreeCreditsByWorkspaceId[workspaceId] ?? 0;
  const previouslySeenCredits = celebratedCredits ?? persistedSeenCredits;

  if (earnedCreditsWithoutTrial < previouslySeenCredits) {
    setCelebratedCredits(earnedCreditsWithoutTrial);
  }

  const markCreditsAsSeen = () => {
    setCelebratedCredits(earnedCreditsWithoutTrial);
    setOnboardingSeenFreeCreditsByWorkspaceId((seenFreeCredits) => ({
      ...seenFreeCredits,
      [workspaceId]: earnedCreditsWithoutTrial,
    }));
  };

  return {
    earnedCreditsWithoutTrial,
    previouslySeenCredits,
    newlyEarnedCredits: earnedCreditsWithoutTrial - previouslySeenCredits,
    isFirstCreditsGain: persistedSeenCredits === 0,
    markCreditsAsSeen,
  };
};
