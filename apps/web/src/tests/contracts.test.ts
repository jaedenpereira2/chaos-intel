import { describe, it, expect } from 'vitest';
import applicationSchema from '../../../../packages/schemas/application.schema.json';
import serviceSchema from '../../../../packages/schemas/service.schema.json';
import findingSchema from '../../../../packages/schemas/finding.schema.json';
import experimentSchema from '../../../../packages/schemas/experiment.schema.json';
import reportSchema from '../../../../packages/schemas/report.schema.json';

describe('Shared Contract Schemas Validation', () => {
  it('validates canonical node types in service.schema.json', () => {
    const nodeTypes = serviceSchema.properties.nodeType.enum;
    expect(nodeTypes).toContain('frontend');
    expect(nodeTypes).toContain('service');
    expect(nodeTypes).toContain('database');
    expect(nodeTypes).toContain('cache');
    expect(nodeTypes).toContain('queue');
    expect(nodeTypes).toContain('external dependency');
  });

  it('validates strict severity enum in finding.schema.json', () => {
    const severities = findingSchema.properties.severity.enum;
    expect(severities).toEqual(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']);
  });

  it('verifies UUID format requirements across key entities', () => {
    expect(applicationSchema.properties.id.format).toBe('uuid');
    expect(serviceSchema.properties.id.format).toBe('uuid');
    expect(findingSchema.properties.id.format).toBe('uuid');
    expect(experimentSchema.properties.id.format).toBe('uuid');
    expect(reportSchema.properties.id.format).toBe('uuid');
  });
});

