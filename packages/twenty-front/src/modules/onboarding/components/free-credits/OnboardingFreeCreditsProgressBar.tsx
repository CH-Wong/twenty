import { styled } from '@linaria/react';
import { motion, useReducedMotion } from 'framer-motion';
import { themeCssVariables } from 'twenty-ui/theme';

const PROGRESS_BAR_WIDTH_PX = 64;
const PROGRESS_BAR_EASE = [0.2, 0, 0, 1] as const;
const PROGRESS_BAR_FILL_SPRING = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
} as const;

const StyledTrack = styled(motion.span)`
  background-color: ${themeCssVariables.background.transparent.medium};
  border-radius: ${themeCssVariables.border.radius.pill};
  corner-shape: round;
  display: block;
  flex-shrink: 0;
  height: 6px;
  overflow: hidden;
  position: relative;
`;

const StyledFill = styled(motion.span)`
  background-color: ${themeCssVariables.color.green9};
  border-radius: ${themeCssVariables.border.radius.pill};
  bottom: 0;
  corner-shape: round;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
`;

const StyledGlint = styled(motion.span)`
  backdrop-filter: brightness(1.6);
  inset: 0;
  mask-image: linear-gradient(90deg, transparent, black, transparent);
  position: absolute;
`;

type OnboardingFreeCreditsProgressBarProps = {
  credits: number;
  goalCredits: number;
  shouldGlint: boolean;
  onTrackGrown: () => void;
};

export const OnboardingFreeCreditsProgressBar = ({
  credits,
  goalCredits,
  shouldGlint,
  onTrackGrown,
}: OnboardingFreeCreditsProgressBarProps) => {
  const shouldReduceMotion = useReducedMotion();

  const fillWidth = `${Math.min(100, Math.max(0, (credits / goalCredits) * 100))}%`;

  return (
    <StyledTrack
      aria-hidden
      initial={{ width: shouldReduceMotion ? PROGRESS_BAR_WIDTH_PX : 0 }}
      animate={{ width: PROGRESS_BAR_WIDTH_PX }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.45, ease: PROGRESS_BAR_EASE }
      }
      onAnimationComplete={onTrackGrown}
    >
      <StyledFill
        initial={{ width: fillWidth }}
        animate={{ width: fillWidth }}
        transition={
          shouldReduceMotion ? { duration: 0 } : PROGRESS_BAR_FILL_SPRING
        }
      >
        {shouldGlint && !shouldReduceMotion && (
          <StyledGlint
            key={credits}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.9, ease: PROGRESS_BAR_EASE }}
          />
        )}
      </StyledFill>
    </StyledTrack>
  );
};
