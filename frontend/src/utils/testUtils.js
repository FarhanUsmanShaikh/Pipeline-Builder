// Test utilities and setup
import { render } from '@testing-library/react';
import fc from 'fast-check';

// Custom render function for testing React components
export const renderWithProviders = (ui, options = {}) => {
  const { ...renderOptions } = options;
  
  return render(ui, {
    ...renderOptions,
  });
};

// Property-based testing generators
export const generators = {
  // Generate valid variable names
  validVariableName: () => fc.string({
    minLength: 1,
    maxLength: 20
  }).filter(str => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str))
    .filter(str => !['break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
      'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function',
      'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch',
      'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
      'let', 'static', 'enum', 'implements', 'package', 'protected', 'interface',
      'private', 'public'].includes(str)),

  // Generate text with variables
  textWithVariables: () => fc.tuple(
    fc.string({ minLength: 0, maxLength: 100 }),
    fc.array(generators.validVariableName(), { minLength: 0, maxLength: 5 })
  ).map(([text, variables]) => {
    let result = text;
    variables.forEach(variable => {
      result += ` {{${variable}}} `;
    });
    return { text: result, expectedVariables: variables };
  }),

  // Generate node configuration
  nodeConfig: () => fc.record({
    title: fc.string({ minLength: 1, maxLength: 50 }),
    handles: fc.array(fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      type: fc.constantFrom('source', 'target'),
      position: fc.constantFrom('Left', 'Right', 'Top', 'Bottom'),
    }), { minLength: 0, maxLength: 10 }),
    fields: fc.array(fc.record({
      name: fc.string({ minLength: 1, maxLength: 20 }),
      type: fc.constantFrom('text', 'select', 'number'),
      defaultValue: fc.anything(),
    }), { minLength: 0, maxLength: 5 }),
  }),

  // Generate pipeline data
  pipelineData: () => fc.record({
    nodes: fc.array(fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      type: fc.constantFrom('customInput', 'customOutput', 'llm', 'text'),
      position: fc.record({
        x: fc.integer({ min: 0, max: 1000 }),
        y: fc.integer({ min: 0, max: 1000 }),
      }),
      data: fc.dictionary(fc.string(), fc.anything()),
    }), { minLength: 0, maxLength: 20 }),
    edges: fc.array(fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      source: fc.string({ minLength: 1, maxLength: 20 }),
      target: fc.string({ minLength: 1, maxLength: 20 }),
      sourceHandle: fc.string({ minLength: 1, maxLength: 20 }),
      targetHandle: fc.string({ minLength: 1, maxLength: 20 }),
    }), { minLength: 0, maxLength: 50 }),
  }),
};

// Test configuration
export const testConfig = {
  propertyTestRuns: 100,
  timeout: 5000,
};

// Mock functions for testing
export const createMockStore = (initialState = {}) => ({
  nodes: [],
  edges: [],
  getNodeID: jest.fn(() => 'mock-id'),
  addNode: jest.fn(),
  onNodesChange: jest.fn(),
  onEdgesChange: jest.fn(),
  onConnect: jest.fn(),
  updateNodeField: jest.fn(),
  ...initialState,
});

export const createMockNode = (overrides = {}) => ({
  id: 'test-node-1',
  type: 'text',
  position: { x: 100, y: 100 },
  data: {
    text: 'Hello {{world}}',
    variables: ['world'],
  },
  ...overrides,
});

export default {
  renderWithProviders,
  generators,
  testConfig,
  createMockStore,
  createMockNode,
};