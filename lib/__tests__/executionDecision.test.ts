import { buildExecutionDecision } from '../executionDecision';

describe('buildExecutionDecision', () => {
  it('marks autonomous only when capability-scoped', () => {
    const decision = buildExecutionDecision({
      proposedDecision: 'approve',
      capabilityScoped: true,
      rationale: 'Capability allows this action.',
    });

    expect(decision).toEqual(
      expect.objectContaining({
        decision: 'approve',
        approval_mode: 'autonomous',
      })
    );
    expect(decision.rationale.toLowerCase()).toContain('capability-scoped');
  });

  it('never marks autonomous when not capability-scoped', () => {
    const decision = buildExecutionDecision({
      proposedDecision: 'approve',
      capabilityScoped: false,
      rationale: 'Looks safe.',
    });

    expect(decision).toEqual(
      expect.objectContaining({
        decision: 'approve',
        approval_mode: 'policy',
      })
    );
    expect(decision.rationale.toLowerCase()).toContain('not capability-scoped');
  });

  it('uses human mode when explicitly human-approved', () => {
    const decision = buildExecutionDecision({
      proposedDecision: 'approve',
      capabilityScoped: true,
      approvedBy: 'human',
      rationale: 'Human reviewer approved.',
    });

    expect(decision).toEqual(
      expect.objectContaining({
        decision: 'approve',
        approval_mode: 'human',
      })
    );
    expect(decision.rationale.toLowerCase()).toContain('human');
  });

  it('vetoes autonomy when any critique blockers exist', () => {
    const decision = buildExecutionDecision({
      proposedDecision: 'approve',
      capabilityScoped: true,
      rationale: 'Capability would allow this.',
      critiques: [{ blockers: ['Found destructive behavior risk'] }],
    });

    expect(decision).toEqual(
      expect.objectContaining({
        decision: 'reject',
        approval_mode: 'policy',
      })
    );
    expect(decision.rationale.toLowerCase()).toContain('critique blockers');
  });
});

