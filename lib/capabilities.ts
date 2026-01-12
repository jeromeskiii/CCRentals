import { z } from 'zod';

export const capabilitySchema = z.enum(['repo.scan', 'fs.read', 'fs.write', 'git.read']);
export type Capability = z.infer<typeof capabilitySchema>;

export const capabilitiesSchema = z.array(capabilitySchema);

