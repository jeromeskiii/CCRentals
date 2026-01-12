import { z } from 'zod';

export const approvalModeSchema = z.enum(['autonomous', 'human', 'policy']);
export type ApprovalMode = z.infer<typeof approvalModeSchema>;

export const decisionSchema = z.enum(['approve', 'reject']);
export type Decision = z.infer<typeof decisionSchema>;

export const executionDecisionSchema = z.object({
  decision: decisionSchema,
  approval_mode: approvalModeSchema,
  rationale: z.string().min(1).trim(),
});

export type ExecutionDecision = z.infer<typeof executionDecisionSchema>;

export interface Critique {
  blockers: string[];
}

export const anyBlockers = (critiques: readonly Critique[] | undefined): boolean => {
  if (!critiques || critiques.length === 0) return false;
  return critiques.some((critique) => (critique.blockers ?? []).length > 0);
};

interface BuildExecutionDecisionInput {
  proposedDecision: Decision;
  rationale: string;
  capabilityScoped: boolean;
  approvedBy?: 'human' | 'policy';
  critiques?: readonly Critique[];
}

const buildRationale = (base: string, extras: readonly string[]): string => {
  const baseTrimmed = base.trim();
  const parts = [baseTrimmed, ...extras.map((s) => s.trim()).filter(Boolean)].filter(Boolean);
  return parts.join(' ');
};

export const buildExecutionDecision = (input: BuildExecutionDecisionInput): ExecutionDecision => {
  const blockers = (input.critiques ?? []).flatMap((c) => c.blockers ?? []).filter(Boolean);

  if (blockers.length > 0) {
    return executionDecisionSchema.parse({
      decision: 'reject',
      approval_mode: 'policy',
      rationale: buildRationale(input.rationale, [
        `Rejected due to critique blockers: ${blockers.join('; ')}.`,
      ]),
    });
  }

  const decision: Decision = input.proposedDecision;
  const approval_mode: ApprovalMode =
    input.approvedBy === 'human'
      ? 'human'
      : input.approvedBy === 'policy'
        ? 'policy'
        : input.capabilityScoped
          ? 'autonomous'
          : 'policy';

  const extras: string[] = [];

  if (approval_mode === 'autonomous') {
    extras.push(
      decision === 'approve'
        ? 'Approved autonomously under capability-scoped rules.'
        : 'Rejected autonomously under capability-scoped rules.'
    );
  } else if (approval_mode === 'human') {
    extras.push(decision === 'approve' ? 'Approved via human review.' : 'Rejected via human review.');
  } else {
    if (!input.capabilityScoped && input.approvedBy !== 'policy') {
      extras.push('Autonomy disallowed because the action was not capability-scoped.');
    }
    extras.push('Decision issued under policy controls.');
  }

  const rationale = buildRationale(input.rationale, extras);

  return executionDecisionSchema.parse({
    decision,
    approval_mode,
    rationale,
  });
};
