import { describe, expect, it } from 'vitest';
import { AUTO_APPROVE_CAPABILITIES, decideAutonomy } from '../autonomyPolicy';

describe('autonomy policy', () => {
  it('pins AUTO_APPROVE_CAPABILITIES as the narrow autonomy envelope', () => {
    expect(Array.from(AUTO_APPROVE_CAPABILITIES).sort()).toEqual(
      ['fs.read', 'git.read', 'repo.scan'].sort()
    );
  });

  it('approves when required_capabilities is a subset of AUTO_APPROVE_CAPABILITIES', () => {
    expect(
      decideAutonomy({
        required_capabilities: ['repo.scan', 'fs.read', 'git.read'],
      })
    ).toEqual({
      decision: 'approve',
      rationale: 'Plan uses only autonomous-safe capabilities.',
    });
  });

  it('approves when required_capabilities is empty', () => {
    expect(
      decideAutonomy({
        required_capabilities: [],
      })
    ).toEqual({
      decision: 'approve',
      rationale: 'Plan uses only autonomous-safe capabilities.',
    });
  });

  it('defers when any capability is outside AUTO_APPROVE_CAPABILITIES', () => {
    expect(
      decideAutonomy({
        required_capabilities: ['fs.read', 'fs.write'],
      })
    ).toEqual({
      decision: 'defer',
      rationale: 'Plan requires capabilities outside the autonomous-safe envelope.',
    });
  });

  it('defers when required_capabilities contains unknown values', () => {
    expect(() =>
      decideAutonomy({
        required_capabilities: ['unknown.capability'],
      })
    ).toThrow();
  });
});
