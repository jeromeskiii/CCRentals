import { type Capability } from './capabilities';
import { type ExecutionDecision } from './executionDecision';

export function toolRunnerAllowsExecution(input: {
  executionDecision?: ExecutionDecision;
  planCapabilities: readonly Capability[];
  toolCapabilities: readonly Capability[];
}): { allowed: boolean } {
  if (!input.executionDecision) return { allowed: false };
  if (input.executionDecision.decision !== 'approve') return { allowed: false };

  const planCapSet = new Set(input.planCapabilities);
  const toolCapsAllowedByPlan = input.toolCapabilities.every((cap) => planCapSet.has(cap));
  return { allowed: toolCapsAllowedByPlan };
}

