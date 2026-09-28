import { type OnboardingCreditsSource } from '@/onboarding/types/OnboardingCreditsSource';
import { type OnboardingCreditsStep } from '@/onboarding/types/OnboardingCreditsStep';

export type OnboardingCreditsProgress = {
  earnedCredits: number;
  earnedCreditsBySource: {
    source: OnboardingCreditsSource;
    credits: number;
    rewardCredits: number;
  }[];
  goalCredits: number;
  currentStep: OnboardingCreditsStep | null;
  currentStepCredits: number;
};
