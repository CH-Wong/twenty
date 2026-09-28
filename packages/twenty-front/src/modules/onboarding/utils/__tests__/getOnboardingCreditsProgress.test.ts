import { type OnboardingConfig } from '@/client-config/types/OnboardingConfig';
import { getOnboardingCreditsProgress } from '@/onboarding/utils/getOnboardingCreditsProgress';
import {
  type OnboardingCreditRewards,
  OnboardingStatus,
} from '~/generated-metadata/graphql';

const onboardingConfig: OnboardingConfig = {
  importContactsCreditsReward: 2,
  inviteTeamCreditsRewardPerUser: 0.5,
  installAppsCreditsReward: 1,
  createProfileCreditsReward: 0.5,
  upgradeCreditsReward: 0.5,
  inviteTeamMaxInvites: 4,
};

const buildCreditRewards = (
  creditRewards: Partial<Omit<OnboardingCreditRewards, '__typename'>> = {},
): Omit<OnboardingCreditRewards, '__typename'> => ({
  importContactsCredits: 0,
  installAppsCredits: 0,
  inviteTeamCredits: 0,
  enrichmentQualificationCredits: 0,
  totalCredits: 0,
  joinedTeammatesCount: 0,
  pendingInvitationsCount: 0,
  ...creditRewards,
});

describe('getOnboardingCreditsProgress', () => {
  it('should offer the email reward on the first step', () => {
    expect(
      getOnboardingCreditsProgress({
        creditRewards: buildCreditRewards(),
        onboardingConfig,
        onboardingStatus: OnboardingStatus.SYNC_EMAIL,
        isFirstWorkspaceMember: true,
        isPlanRequired: true,
      }),
    ).toEqual({
      earnedCredits: 0,
      earnedCreditsBySource: [],
      goalCredits: 0,
      currentStep: 'importContacts',
      currentStepCredits: 2,
    });
  });

  it('should leave the step at hand out of the goal until it is done', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards({
        importContactsCredits: 2,
        totalCredits: 2,
      }),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.APPS_INSTALLATION,
      isFirstWorkspaceMember: true,
      isPlanRequired: false,
    });

    expect(progress.earnedCredits).toBe(2);
    expect(progress.goalCredits).toBe(2);
    expect(progress.currentStep).toBe('installApps');
    expect(progress.currentStepCredits).toBe(1);
  });

  it('should not point at a step once its reward is earned', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards({
        importContactsCredits: 2,
        installAppsCredits: 2,
        totalCredits: 4,
      }),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.APPS_INSTALLATION,
      isFirstWorkspaceMember: true,
      isPlanRequired: false,
    });

    expect(progress.currentStep).toBeNull();
    expect(progress.currentStepCredits).toBe(0);
  });

  it('should keep skipped steps in the goal on the profile step', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards(),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.PROFILE_CREATION,
      isFirstWorkspaceMember: true,
      isPlanRequired: false,
    });

    expect(progress.earnedCredits).toBe(0);
    expect(progress.goalCredits).toBe(3);
    expect(progress.currentStep).toBe('createProfile');
  });

  it('should count the trial credits as earned once the profile is created', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards(),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.INVITE_TEAM,
      isFirstWorkspaceMember: true,
      isPlanRequired: false,
    });

    expect(progress.earnedCredits).toBe(0.5);
    expect(progress.goalCredits).toBe(3.5);
  });

  it('should count the current step picks live', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards(),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.APPS_INSTALLATION,
      isFirstWorkspaceMember: true,
      isPlanRequired: false,
      onboardingDraftCredits: { installApps: 1 },
    });

    expect(progress.earnedCredits).toBe(1);
    expect(progress.goalCredits).toBe(3);
    expect(progress.currentStep).toBeNull();
  });

  it('should count the trial picked by default on the last step live', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards({
        importContactsCredits: 2,
        totalCredits: 2,
      }),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.PLAN_REQUIRED,
      isFirstWorkspaceMember: true,
      isPlanRequired: true,
      onboardingDraftCredits: { upgradeTrial: 0.5 },
    });

    expect(progress.earnedCredits).toBe(3);
    expect(progress.currentStep).toBeNull();
  });

  it('should cap submitted invite picks to the invite reward', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards(),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.BOOK_CALL,
      isFirstWorkspaceMember: false,
      isPlanRequired: false,
      onboardingDraftCredits: { inviteTeam: 5 },
    });

    expect(progress.earnedCredits).toBe(2);
  });

  it('should count submitted picks as earned until the server grants them', () => {
    const submittedProgress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards(),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.PROFILE_CREATION,
      isFirstWorkspaceMember: true,
      isPlanRequired: false,
      onboardingDraftCredits: { installApps: 1 },
    });
    const grantedProgress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards({
        installAppsCredits: 1,
        totalCredits: 1,
      }),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.PROFILE_CREATION,
      isFirstWorkspaceMember: true,
      isPlanRequired: false,
      onboardingDraftCredits: { installApps: 1 },
    });

    expect(submittedProgress.earnedCredits).toBe(1);
    expect(grantedProgress.earnedCredits).toBe(1);
  });

  it('should count pending invites as earned', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards({
        importContactsCredits: 2,
        totalCredits: 2,
        pendingInvitationsCount: 1,
      }),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.INVITE_TEAM,
      isFirstWorkspaceMember: true,
      isPlanRequired: false,
    });

    expect(progress.earnedCredits).toBe(3);
    expect(progress.currentStep).toBe('inviteTeam');
    expect(progress.currentStepCredits).toBe(1.5);
  });

  it('should leave out first-member rewards for other members', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards(),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.SYNC_EMAIL,
      isFirstWorkspaceMember: false,
      isPlanRequired: false,
    });

    expect(progress.goalCredits).toBe(0);
    expect(progress.currentStep).toBeNull();
  });

  it('should grow the goal to fit a company bonus', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards({
        enrichmentQualificationCredits: 5,
        totalCredits: 5,
      }),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.SYNC_EMAIL,
      isFirstWorkspaceMember: true,
      isPlanRequired: false,
    });

    expect(progress.earnedCredits).toBe(5);
    expect(progress.goalCredits).toBe(5);
  });

  it('should point at the upgrade reward on the plan step', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards({
        importContactsCredits: 2,
        totalCredits: 2,
      }),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.PLAN_REQUIRED,
      isFirstWorkspaceMember: true,
      isPlanRequired: true,
    });

    expect(progress.goalCredits).toBe(4);
    expect(progress.currentStep).toBe('upgradeTrial');
    expect(progress.currentStepCredits).toBe(0.5);
  });

  it('should leave out the upgrade reward once the workspace has a plan', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards(),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.COMPLETED,
      isFirstWorkspaceMember: true,
      isPlanRequired: false,
    });

    expect(progress.goalCredits).toBe(3.5);
  });

  it('should count only the sent invites once past the invite step', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards({
        importContactsCredits: 2,
        totalCredits: 2,
        pendingInvitationsCount: 1,
      }),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.PLAN_REQUIRED,
      isFirstWorkspaceMember: true,
      isPlanRequired: true,
    });

    expect(progress.earnedCredits).toBe(3);
    expect(progress.goalCredits).toBe(4.5);
  });

  it('should recap what each step done earned out of its reward', () => {
    const progress = getOnboardingCreditsProgress({
      creditRewards: buildCreditRewards({
        importContactsCredits: 2,
        totalCredits: 2,
        pendingInvitationsCount: 1,
      }),
      onboardingConfig,
      onboardingStatus: OnboardingStatus.PLAN_REQUIRED,
      isFirstWorkspaceMember: true,
      isPlanRequired: true,
    });

    expect(progress.earnedCreditsBySource).toEqual([
      { source: 'importContacts', credits: 2, rewardCredits: 2 },
      { source: 'installApps', credits: 0, rewardCredits: 1 },
      { source: 'createProfile', credits: 0.5, rewardCredits: 0.5 },
      { source: 'inviteTeam', credits: 0.5, rewardCredits: 2 },
      { source: 'upgradeTrial', credits: 0, rewardCredits: 0.5 },
    ]);
  });
});
