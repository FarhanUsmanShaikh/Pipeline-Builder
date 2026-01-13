// Node configuration utilities and presets
import { Position } from 'reactflow';
import { colors } from '../styles/constants';

/**
 * Helper function to create handle configurations
 */
export const createHandle = (id, type, position, style = {}) => ({
  id,
  type,
  position,
  style,
});

/**
 * Helper function to create field configurations
 */
export const createField = (name, type = 'text', options = {}) => ({
  name,
  type,
  label: options.label || name.charAt(0).toUpperCase() + name.slice(1),
  defaultValue: options.defaultValue || '',
  placeholder: options.placeholder,
  options: options.options, // For select fields
  ...options,
});

/**
 * Common handle presets
 */
export const handlePresets = {
  // Single input on left
  singleInput: (id = 'input') => [
    createHandle(`${id}-input`, 'target', 'Left')
  ],
  
  // Single output on right
  singleOutput: (id = 'output') => [
    createHandle(`${id}-output`, 'source', 'Right')
  ],
  
  // Input and output
  inputOutput: (id = 'value') => [
    createHandle(`${id}-input`, 'target', 'Left'),
    createHandle(`${id}-output`, 'source', 'Right')
  ],
  
  // Multiple inputs (system, prompt) for LLM
  llmHandles: (id) => [
    createHandle(`${id}-system`, 'target', 'Left', { top: '33%' }),
    createHandle(`${id}-prompt`, 'target', 'Left', { top: '66%' }),
    createHandle(`${id}-response`, 'source', 'Right')
  ],
  
  // Dynamic handles (for text nodes with variables)
  dynamicInputs: (id, variables = []) => [
    ...variables.map((variable, index) => 
      createHandle(`${id}-${variable}`, 'target', 'Left', { 
        top: `${(index + 1) * (100 / (variables.length + 1))}%` 
      })
    ),
    createHandle(`${id}-output`, 'source', 'Right')
  ],
};

/**
 * Common field presets
 */
export const fieldPresets = {
  // Name field
  name: (defaultValue = '') => createField('name', 'text', {
    label: 'Name',
    defaultValue,
    placeholder: 'Enter name'
  }),
  
  // Type selector
  type: (options = [], defaultValue = '') => createField('type', 'select', {
    label: 'Type',
    defaultValue,
    options: options.map(opt => 
      typeof opt === 'string' ? { value: opt, label: opt } : opt
    )
  }),
  
  // Text content
  text: (defaultValue = '') => createField('text', 'textarea', {
    label: 'Text',
    defaultValue,
    placeholder: 'Enter text content'
  }),
  
  // Description
  description: (defaultValue = '') => createField('description', 'textarea', {
    label: 'Description',
    defaultValue,
    placeholder: 'Enter description'
  }),
  
  // URL field
  url: (defaultValue = '') => createField('url', 'text', {
    label: 'URL',
    defaultValue,
    placeholder: 'https://example.com'
  }),
  
  // Number field
  number: (defaultValue = 0, min, max) => createField('value', 'number', {
    label: 'Value',
    defaultValue,
    min,
    max
  }),
};

/**
 * Predefined node configurations
 */
export const nodeConfigs = {
  // Input node configuration
  customInput: {
    title: 'Input',
    icon: 'IN',
    iconColor: colors.primary[500],
    handles: handlePresets.singleOutput('input'),
    fields: [
      fieldPresets.name('input'),
      fieldPresets.type(['Text', 'File'], 'Text')
    ],
  },
  
  // Output node configuration
  customOutput: {
    title: 'Output',
    icon: 'OUT',
    iconColor: colors.success,
    handles: handlePresets.singleInput('output'),
    fields: [
      fieldPresets.name('output'),
      fieldPresets.type(['Text', 'Image'], 'Text')
    ],
  },
  
  // LLM node configuration
  llm: {
    title: 'LLM',
    icon: 'AI',
    iconColor: colors.primary[700],
    handles: handlePresets.llmHandles('llm'),
    fields: [
      createField('model', 'select', {
        label: 'Model',
        defaultValue: 'gpt-3.5-turbo',
        options: [
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
          { value: 'gpt-4', label: 'GPT-4' },
          { value: 'claude-3', label: 'Claude 3' }
        ]
      }),
      createField('temperature', 'number', {
        label: 'Temperature',
        defaultValue: 0.7,
        min: 0,
        max: 2,
        step: 0.1
      })
    ],
  },
  
  // Text node configuration (will be enhanced with dynamic handles)
  text: {
    title: 'Text',
    icon: 'T',
    iconColor: colors.gray[600],
    handles: handlePresets.singleOutput('text'),
    fields: [
      fieldPresets.text('{{input}}')
    ],
  },
  
  // Database node
  database: {
    title: 'Database',
    icon: 'DB',
    iconColor: colors.primary[800],
    handles: handlePresets.inputOutput('db'),
    fields: [
      fieldPresets.url('postgresql://localhost:5432/mydb'),
      createField('query', 'textarea', {
        label: 'Query',
        defaultValue: 'SELECT * FROM table WHERE id = {{id}}',
        placeholder: 'Enter SQL query'
      })
    ],
  },
  
  // API node
  api: {
    title: 'API',
    icon: 'API',
    iconColor: colors.warning,
    handles: handlePresets.inputOutput('api'),
    fields: [
      fieldPresets.url('https://api.example.com/endpoint'),
      createField('method', 'select', {
        label: 'Method',
        defaultValue: 'GET',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' }
        ]
      }),
      createField('headers', 'textarea', {
        label: 'Headers (JSON)',
        defaultValue: '{"Content-Type": "application/json"}',
        placeholder: 'Enter headers as JSON'
      })
    ],
  },
  
  // Filter node
  filter: {
    title: 'Filter',
    icon: 'F',
    iconColor: colors.primary[600],
    handles: handlePresets.inputOutput('filter'),
    fields: [
      createField('condition', 'text', {
        label: 'Condition',
        defaultValue: 'value > 0',
        placeholder: 'Enter filter condition'
      }),
      createField('operator', 'select', {
        label: 'Operator',
        defaultValue: 'and',
        options: [
          { value: 'and', label: 'AND' },
          { value: 'or', label: 'OR' },
          { value: 'not', label: 'NOT' }
        ]
      })
    ],
  },
  
  // Transform node
  transform: {
    title: 'Transform',
    icon: 'TR',
    iconColor: colors.primary[400],
    handles: handlePresets.inputOutput('transform'),
    fields: [
      createField('operation', 'select', {
        label: 'Operation',
        defaultValue: 'map',
        options: [
          { value: 'map', label: 'Map' },
          { value: 'reduce', label: 'Reduce' },
          { value: 'filter', label: 'Filter' },
          { value: 'sort', label: 'Sort' }
        ]
      }),
      createField('expression', 'textarea', {
        label: 'Expression',
        defaultValue: 'x => x * 2',
        placeholder: 'Enter transformation expression'
      })
    ],
  },
  
  // Conditional node
  conditional: {
    title: 'Conditional',
    icon: 'IF',
    iconColor: colors.warning,
    handles: [
      createHandle('conditional-input', 'target', 'Left'),
      createHandle('conditional-true', 'source', 'Right', { top: '33%' }),
      createHandle('conditional-false', 'source', 'Right', { top: '66%' })
    ],
    fields: [
      createField('condition', 'text', {
        label: 'Condition',
        defaultValue: 'input === "true"',
        placeholder: 'Enter condition'
      })
    ],
  },
};

/**
 * Get configuration for a node type
 */
export const getNodeConfig = (nodeType) => {
  return nodeConfigs[nodeType] || nodeConfigs.text;
};

/**
 * Create a custom node configuration
 */
export const createNodeConfig = (config) => {
  return {
    title: 'Custom Node',
    icon: 'C',
    iconColor: colors.gray[500],
    handles: [],
    fields: [],
    ...config,
  };
};

export default {
  createHandle,
  createField,
  handlePresets,
  fieldPresets,
  nodeConfigs,
  getNodeConfig,
  createNodeConfig,
};