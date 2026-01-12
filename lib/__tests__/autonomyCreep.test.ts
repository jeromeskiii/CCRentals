import { describe, expect, it } from 'vitest';
import { decideAutonomy } from '../autonomyPolicy';
import { capabilitiesSchema } from '../capabilities';
import { buildExecutionDecision } from '../executionDecision';
import { toolRunnerAllowsExecution } from '../toolRunner';

describe('autonomy creep guards', () => {
  it('{"repo.scan"} -> auto-approve', () => {
    expect(
      decideAutonomy({
        required_capabilities: ['repo.scan'],
      })
    ).toEqual({
      decision: 'approve',
      rationale: 'Plan uses only autonomous-safe capabilities.',
    });
  });

  it('{"fs.read"} -> auto-approve', () => {
    expect(
      decideAutonomy({
        required_capabilities: ['fs.read'],
      })
    ).toEqual({
      decision: 'approve',
      rationale: 'Plan uses only autonomous-safe capabilities.',
    });
  });

  it('{"git.read"} -> auto-approve', () => {
    expect(
      decideAutonomy({
        required_capabilities: ['git.read'],
      })
    ).toEqual({
      decision: 'approve',
      rationale: 'Plan uses only autonomous-safe capabilities.',
    });
  });

  it('{"fs.read", "fs.write"} -> no auto-approve', () => {
    expect(
      decideAutonomy({
        required_capabilities: ['fs.read', 'fs.write'],
      })
    ).toEqual({
      decision: 'defer',
      rationale: 'Plan requires capabilities outside the autonomous-safe envelope.',
    });
  });

  it('safe capabilities + critique blocker -> reject', () => {
    const decision = buildExecutionDecision({
      proposedDecision: 'approve',
      capabilityScoped: true,
      rationale: 'Capability would allow this.',
      critiques: [{ blockers: ['Found destructive behavior risk'] }],
    });

    expect(decision.decision).toBe('reject');
  });

  it('tool asks for capability not in plan -> reject', () => {
    const result = toolRunnerAllowsExecution({
      executionDecision: buildExecutionDecision({
        proposedDecision: 'approve',
        capabilityScoped: true,
        rationale: 'Approved.',
      }),
      planCapabilities: capabilitiesSchema.parse(['repo.scan']),
      toolCapabilities: capabilitiesSchema.parse(['fs.read']),
    });

    expect(result.allowed).toBe(false);
  });

  it('unknown capability string -> schema reject', () => {
    expect(() => capabilitiesSchema.parse(['repo.scan', 'unknown.cap'])).toThrow();
  });

  it('ToolRunner rejects when execution_decision missing', () => {
    const result = toolRunnerAllowsExecution({
      planCapabilities: capabilitiesSchema.parse(['repo.scan', 'fs.read', 'fs.write']),
      toolCapabilities: capabilitiesSchema.parse(['repo.scan']),
    });

    expect(result.allowed).toBe(false);
  });
});
