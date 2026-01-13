// toolbar.js

import styled from 'styled-components';
import { DraggableNode } from './draggableNode';
import { colors, spacing, typography, borderRadius, shadows } from './styles/constants';

const ToolbarContainer = styled.div`
  background: linear-gradient(135deg, ${colors.surface} 0%, ${colors.gray[50]} 100%);
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.xl};
  padding: ${spacing.xl};
  box-shadow: ${shadows.lg};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 50%, ${colors.primary[500]} 100%);
  }
`;

const ToolbarTitle = styled.h2`
  margin: 0 0 ${spacing.lg} 0;
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[800]};
  font-family: ${typography.fontFamily.sans.join(', ')};
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, ${colors.primary[400]} 0%, ${colors.primary[600]} 100%);
    border-radius: ${borderRadius.full};
  }
`;

const ToolbarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${spacing.md};
  max-width: 1200px;
`;

const NodeSection = styled.div`
  margin-bottom: ${spacing.lg};
`;

const SectionTitle = styled.h3`
  margin: 0 0 ${spacing.sm} 0;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[600]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const PipelineToolbar = () => {
    const basicNodes = [
        { type: 'customInput', label: 'Input', icon: '📥' },
        { type: 'customOutput', label: 'Output', icon: '📤' },
        { type: 'text', label: 'Text', icon: '📝' },
        { type: 'llm', label: 'LLM', icon: '🤖' },
    ];

    const advancedNodes = [
        { type: 'database', label: 'Database', icon: '🗄️' },
        { type: 'api', label: 'API', icon: '🌐' },
        { type: 'filter', label: 'Filter', icon: '🔍' },
        { type: 'transform', label: 'Transform', icon: '⚡' },
        { type: 'conditional', label: 'Conditional', icon: '🔀' },
    ];

    return (
        <ToolbarContainer>
            <ToolbarTitle>Pipeline Components</ToolbarTitle>
            
            <NodeSection>
                <SectionTitle>Basic Nodes</SectionTitle>
                <ToolbarGrid>
                    {basicNodes.map(node => (
                        <DraggableNode 
                            key={node.type}
                            type={node.type} 
                            label={node.label}
                            icon={node.icon}
                        />
                    ))}
                </ToolbarGrid>
            </NodeSection>

            <NodeSection>
                <SectionTitle>Advanced Nodes</SectionTitle>
                <ToolbarGrid>
                    {advancedNodes.map(node => (
                        <DraggableNode 
                            key={node.type}
                            type={node.type} 
                            label={node.label}
                            icon={node.icon}
                        />
                    ))}
                </ToolbarGrid>
            </NodeSection>
        </ToolbarContainer>
    );
};
