import { OnboardingFreeCreditsAnimatedCount } from '@/onboarding/components/free-credits/OnboardingFreeCreditsAnimatedCount';
import { OnboardingFreeCreditsProgressBar } from '@/onboarding/components/free-credits/OnboardingFreeCreditsProgressBar';
import { StyledOnboardingFreeCreditsCount } from '@/onboarding/components/free-credits/StyledOnboardingFreeCreditsCount';
import { StyledOnboardingFreeCreditsLabel } from '@/onboarding/components/free-credits/StyledOnboardingFreeCreditsLabel';
import { StyledOnboardingFreeCreditsText } from '@/onboarding/components/free-credits/StyledOnboardingFreeCreditsText';
import { plural } from '@lingui/core/macro';

type OnboardingFreeCreditsProgressProps = {
  earnedCredits: number;
  goalCredits: number;
  previouslySeenCredits: number;
  hasNewlyEarnedCredits: boolean;
  hasTrackGrown: boolean;
  onTrackGrown: () => void;
};

export const OnboardingFreeCreditsProgress = ({
  earnedCredits,
  goalCredits,
  previouslySeenCredits,
  hasNewlyEarnedCredits,
  hasTrackGrown,
  onTrackGrown,
}: OnboardingFreeCreditsProgressProps) => {
  const displayedCredits = hasTrackGrown
    ? earnedCredits
    : Math.min(previouslySeenCredits, earnedCredits);

  return (
    <>
      <OnboardingFreeCreditsProgressBar
        credits={displayedCredits}
        goalCredits={goalCredits}
        shouldGlint={hasTrackGrown && hasNewlyEarnedCredits}
        onTrackGrown={onTrackGrown}
      />
      <StyledOnboardingFreeCreditsText>
        <StyledOnboardingFreeCreditsCount>
          <OnboardingFreeCreditsAnimatedCount credits={displayedCredits} />
          /
          <OnboardingFreeCreditsAnimatedCount credits={goalCredits} />
        </StyledOnboardingFreeCreditsCount>
        <StyledOnboardingFreeCreditsLabel>
          {plural(goalCredits, {
            one: 'free credit',
            other: 'free credits',
          })}
        </StyledOnboardingFreeCreditsLabel>
      </StyledOnboardingFreeCreditsText>
    </>
  );
};
