// BaseNode.js - Abstract base component for all node types
import React, { useState, useEffect, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/constants';

// Styled components for consistent node styling
const NodeContainer = styled.div`
  background: ${colors.surface};
  border: 2px solid ${props => props.selected ? colors.primary[500] : colors.border};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.md};
  padding: ${spacing.md};
  min-width: 200px;
  font-family: ${typography.fontFamily.sans.join(', ')};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    border-color: ${colors.primary[300]};
    box-shadow: ${shadows.lg};
  }
  
  ${props => props.customStyle && props.customStyle}
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.sm};
  padding-bottom: ${spacing.sm};
  border-bottom: 1px solid ${colors.gray[200]};
`;

const NodeTitle = styled.h3`
  margin: 0;
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.gray[800]};
`;

const NodeIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: ${borderRadius.sm};
  background: ${props => props.color || colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.bold};
`;

const NodeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const FieldLabel = styled.label`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[700]};
`;

const FieldInput = styled.input`
  padding: ${spacing.xs} ${spacing.sm};
  border: 1px solid ${colors.gray[300]};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSize.sm};
  transition: border-color 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const FieldSelect = styled.select`
  padding: ${spacing.xs} ${spacing.sm};
  border: 1px solid ${colors.gray[300]};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSize.sm};
  background: white;
  transition: border-color 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const FieldTextarea = styled.textarea`
  padding: ${spacing.xs} ${spacing.sm};
  border: 1px solid ${colors.gray[300]};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSize.sm};
  resize: vertical;
  min-height: 60px;
  font-family: ${typography.fontFamily.sans.join(', ')};
  transition: border-color 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const StyledHandle = styled(Handle)`
  width: 12px;
  height: 12px;
  border: 2px solid ${colors.surface};
  background: ${props => props.handletype === 'source' ? colors.success : colors.primary[500]};
  
  &:hover {
    transform: scale(1.2);
  }
  
  &.react-flow__handle-connecting {
    background: ${colors.warning};
  }
`;

/**
 * BaseNode - Reusable base component for all node types
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique node ID
 * @param {Object} props.data - Node data object
 * @param {boolean} props.selected - Whether node is selected
 * @param {Object} props.config - Node configuration object
 * @param {Function} props.onFieldChange - Callback for field changes
 */
const BaseNode = ({ 
  id, 
  data = {}, 
  selected = false, 
  config = {}, 
  onFieldChange 
}) => {
  const [fieldValues, setFieldValues] = useState({});

  // Extract configuration with defaults
  const {
    title = 'Node',
    icon = title.charAt(0).toUpperCase(),
    iconColor = colors.primary[500],
    handles = [],
    fields = [],
    style = {},
    minWidth = 200,
    minHeight = 80,
  } = config;

  // Initialize field values from data
  useEffect(() => {
    const initialValues = {};
    fields.forEach(field => {
      initialValues[field.name] = data[field.name] ?? field.defaultValue ?? '';
    });
    setFieldValues(initialValues);
  }, [data, fields]);

  // Handle field value changes
  const handleFieldChange = (fieldName, value) => {
    const newValues = { ...fieldValues, [fieldName]: value };
    setFieldValues(newValues);
    
    // Call external change handler if provided
    if (onFieldChange) {
      onFieldChange(id, fieldName, value);
    }
  };

  // Render field based on type
  const renderField = (field) => {
    const { name, type, label, options, placeholder, ...fieldProps } = field;
    const value = fieldValues[name] || '';

    const commonProps = {
      id: `${id}-${name}`,
      value,
      placeholder: placeholder || `Enter ${label || name}`,
      ...fieldProps,
    };

    switch (type) {
      case 'select':
        return (
          <FieldSelect
            {...commonProps}
            onChange={(e) => handleFieldChange(name, e.target.value)}
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FieldSelect>
        );
      
      case 'textarea':
        return (
          <FieldTextarea
            {...commonProps}
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );
      
      case 'number':
        return (
          <FieldInput
            {...commonProps}
            type="number"
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );
      
      default: // text
        return (
          <FieldInput
            {...commonProps}
            type="text"
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );
    }
  };

  // Render handles based on configuration
  const renderHandles = () => {
    return handles.map((handle, index) => {
      const {
        id: handleId,
        type,
        position,
        style: handleStyle = {},
        ...handleProps
      } = handle;

      return (
        <StyledHandle
          key={handleId || `${type}-${index}`}
          type={type}
          position={Position[position] || Position.Left}
          id={handleId || `${id}-${type}-${index}`}
          handletype={type}
          style={handleStyle}
          {...handleProps}
        />
      );
    });
  };

  // Memoize container style
  const containerStyle = useMemo(() => ({
    minWidth: `${minWidth}px`,
    minHeight: `${minHeight}px`,
    ...style,
  }), [minWidth, minHeight, style]);

  return (
    <NodeContainer 
      selected={selected} 
      customStyle={containerStyle}
      data-testid={`node-${id}`}
    >
      {/* Render handles */}
      {renderHandles()}
      
      {/* Node header */}
      <NodeHeader>
        <NodeTitle>{title}</NodeTitle>
        <NodeIcon color={iconColor}>
          {icon}
        </NodeIcon>
      </NodeHeader>

      {/* Node content */}
      <NodeContent>
        {fields.map(field => (
          <FieldContainer key={field.name}>
            {field.label && (
              <FieldLabel htmlFor={`${id}-${field.name}`}>
                {field.label}:
              </FieldLabel>
            )}
            {renderField(field)}
          </FieldContainer>
        ))}
      </NodeContent>
    </NodeContainer>
  );
};

export default BaseNode;