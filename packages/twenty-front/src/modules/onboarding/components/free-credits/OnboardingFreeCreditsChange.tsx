import { StyledOnboardingFreeCreditsChange } from '@/onboarding/components/free-credits/StyledOnboardingFreeCreditsChange';
import { useOnboardingFreeCreditsChangeAnimation } from '@/onboarding/hooks/useOnboardingFreeCreditsChangeAnimation';

type OnboardingFreeCreditsChangeProps = {
  label: string;
  delay: number;
  onDisplayed: () => void;
};

export const OnboardingFreeCreditsChange = ({
  label,
  delay,
  onDisplayed,
}: OnboardingFreeCreditsChangeProps) => {
  const scope = useOnboardingFreeCreditsChangeAnimation({ delay, onDisplayed });

  return (
    <StyledOnboardingFreeCreditsChange ref={scope}>
      {label}
    </StyledOnboardingFreeCreditsChange>
  );
};
