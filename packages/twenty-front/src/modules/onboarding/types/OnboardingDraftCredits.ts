import { type OnboardingCreditsStep } from '@/onboarding/types/OnboardingCreditsStep';

export type OnboardingDraftCredits = Partial<
  Record<OnboardingCreditsStep, number>
>;
