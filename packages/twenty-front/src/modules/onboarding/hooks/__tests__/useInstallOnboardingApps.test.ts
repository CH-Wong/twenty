import { act, renderHook } from '@testing-library/react';
import { Provider as JotaiProvider } from 'jotai';
import { createElement } from 'react';

import { useInstallOnboardingApps } from '@/onboarding/hooks/useInstallOnboardingApps';
import {
  jotaiStore,
  resetJotaiStore,
} from '@/ui/utilities/state/jotai/jotaiStore';

const mockTriggerInstallAppsOnboardingStep = jest.fn();

jest.mock('@/onboarding/hooks/useTriggerInstallAppsOnboardingStep', () => ({
  useTriggerInstallAppsOnboardingStep: () =>
    mockTriggerInstallAppsOnboardingStep,
}));

const Wrapper = ({ children }: { children: React.ReactNode }) =>
  createElement(JotaiProvider, { store: jotaiStore }, children);

const renderInstallHook = () => {
  const { result } = renderHook(
    () => ({ installOnboardingApps: useInstallOnboardingApps() }),
    { wrapper: Wrapper },
  );

  return result;
};

describe('useInstallOnboardingApps', () => {
  beforeEach(() => {
    localStorage.clear();
    resetJotaiStore();
    mockTriggerInstallAppsOnboardingStep.mockReset();
  });

  it('should install the selected apps once the step succeeds', async () => {
    mockTriggerInstallAppsOnboardingStep.mockResolvedValue(undefined);

    const result = renderInstallHook();

    act(() => {
      result.current.installOnboardingApps.toggleApp('app-1');
    });
    act(() => {
      result.current.installOnboardingApps.toggleApp('app-2');
    });

    await act(async () => {
      await result.current.installOnboardingApps.installSelectedAppsAndContinue();
    });

    expect(mockTriggerInstallAppsOnboardingStep).toHaveBeenCalledWith({
      universalIdentifiers: ['app-1', 'app-2'],
      isAutoSkipped: false,
    });
  });

  it('should reset the completing state when the step fails', async () => {
    mockTriggerInstallAppsOnboardingStep.mockRejectedValue(
      new Error('network error'),
    );

    const result = renderInstallHook();

    act(() => {
      result.current.installOnboardingApps.toggleApp('app-1');
    });

    await act(async () => {
      await result.current.installOnboardingApps.installSelectedAppsAndContinue();
    });

    expect(result.current.installOnboardingApps.isCompleting).toBe(false);
  });

  it('should allow retrying after a failed attempt', async () => {
    mockTriggerInstallAppsOnboardingStep
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce(undefined);

    const result = renderInstallHook();

    act(() => {
      result.current.installOnboardingApps.toggleApp('app-1');
    });

    await act(async () => {
      await result.current.installOnboardingApps.installSelectedAppsAndContinue();
    });

    await act(async () => {
      await result.current.installOnboardingApps.installSelectedAppsAndContinue();
    });

    expect(mockTriggerInstallAppsOnboardingStep).toHaveBeenCalledTimes(2);
  });

  it('should ignore a second submission while one is already in flight', async () => {
    let resolveTrigger: () => void = () => {};

    mockTriggerInstallAppsOnboardingStep.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveTrigger = resolve;
      }),
    );

    const result = renderInstallHook();

    act(() => {
      result.current.installOnboardingApps.toggleApp('app-1');
    });

    act(() => {
      void result.current.installOnboardingApps.installSelectedAppsAndContinue();
    });

    expect(result.current.installOnboardingApps.isCompleting).toBe(true);

    act(() => {
      void result.current.installOnboardingApps.skip();
    });

    expect(mockTriggerInstallAppsOnboardingStep).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveTrigger();
    });
  });
});
