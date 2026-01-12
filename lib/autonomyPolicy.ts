import { capabilitiesSchema, type Capability } from './capabilities';

export const AUTO_APPROVE_CAPABILITIES = new Set<Capability>([
  'repo.scan',
  'fs.read',
  'git.read',
]);

export type PolicyDecision = 'approve' | 'defer';

export interface PlanLike {
  required_capabilities?: unknown;
}

export interface PolicyOutcome {
  decision: PolicyDecision;
  rationale: string;
}

export const decideAutonomy = (plan: PlanLike): PolicyOutcome => {
  const required = new Set(capabilitiesSchema.parse(plan.required_capabilities ?? []));

  for (const capability of required) {
    if (!AUTO_APPROVE_CAPABILITIES.has(capability)) {
      return {
        decision: 'defer',
        rationale: 'Plan requires capabilities outside the autonomous-safe envelope.',
      };
    }
  }

  return {
    decision: 'approve',
    rationale: 'Plan uses only autonomous-safe capabilities.',
  };
};
