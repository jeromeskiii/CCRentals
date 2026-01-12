import { decideAutonomy } from './autonomyPolicy';
import { capabilitiesSchema, type Capability } from './capabilities';
import {
  buildExecutionDecision as buildDecision,
  type ExecutionDecision,
} from './executionDecision';
import { toolRunnerAllowsExecution } from './toolRunner';

export { capabilitiesSchema };
export type { Capability, ExecutionDecision };
export { toolRunnerAllowsExecution };

export function buildExecutionDecision(input: {
  requestedCapabilities: readonly Capability[];
  critiqueBlocker: boolean;
}): ExecutionDecision {
  if (input.critiqueBlocker) {
    return buildDecision({
      proposedDecision: 'approve',
      capabilityScoped: true,
      rationale: 'Critique blocker present.',
      critiques: [{ blockers: ['Critique blocker present'] }],
    });
  }

  const autonomyOutcome = decideAutonomy({
    required_capabilities: input.requestedCapabilities,
  });

  if (autonomyOutcome.decision === 'approve') {
    return buildDecision({
      proposedDecision: 'approve',
      capabilityScoped: true,
      rationale: autonomyOutcome.rationale,
    });
  }

  return buildDecision({
    proposedDecision: 'reject',
    capabilityScoped: false,
    approvedBy: 'policy',
    rationale: `${autonomyOutcome.rationale} Human approval required.`,
  });
}
