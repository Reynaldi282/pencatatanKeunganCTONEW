import { describe, it, expect } from 'vitest';

import openApiDocument from '../src/docs/openapi';

describe('OpenAPI document', () => {
  it('exposes the expected api metadata', () => {
    expect(openApiDocument.info.title).toBe('Finance Sync Platform API');
    expect(openApiDocument.info.version).toBe('1.0.0');
  });

  it('includes a swagger path for authentication and transactions', () => {
    expect(openApiDocument.paths?.['/api/auth/login']).toBeDefined();
    expect(openApiDocument.paths?.['/api/transactions']).toBeDefined();
  });

  it('declares bearer authentication security scheme', () => {
    const securitySchemes = openApiDocument.components?.securitySchemes;
    expect(securitySchemes?.bearerAuth).toBeDefined();
  });

  it('references monetary amount schema in transaction component', () => {
    const transactionSchema = openApiDocument.components?.schemas?.Transaction;
    if (!transactionSchema || '$ref' in transactionSchema) {
      throw new Error('Transaction schema is not defined as a schema object');
    }

    const amountSchema = transactionSchema.properties?.amount;
    expect(amountSchema).toEqual({ $ref: '#/components/schemas/MonetaryAmount' });
  });
});
