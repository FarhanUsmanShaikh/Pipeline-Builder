// ResultsModal.js - Beautiful modal for displaying pipeline analysis results
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/constants';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  padding: ${spacing.md};
  box-sizing: border-box;
`;

const ModalContainer = styled.div`
  background: ${colors.surface};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.xl};
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  animation: ${slideIn} 0.3s ease-out;
  border: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  
  @media (max-height: 600px) {
    max-height: 95vh;
  }
  
  @media (max-width: 640px) {
    width: 95%;
    max-height: 90vh;
  }
`;

const ModalHeader = styled.div`
  padding: ${spacing.xl};
  border-bottom: 1px solid ${colors.border};
  background: linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.primary[100]} 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[800]};
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${typography.fontSize.xl};
  color: ${colors.gray[500]};
  cursor: pointer;
  padding: ${spacing.sm};
  border-radius: ${borderRadius.md};
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:hover {
    background: ${colors.gray[100]};
    color: ${colors.gray[700]};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const ModalBody = styled.div`
  padding: ${spacing.xl};
  max-height: 50vh;
  overflow-y: auto;
  flex: 1;
`;

const ResultCard = styled.div`
  background: ${colors.gray[50]};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  margin-bottom: ${spacing.lg};
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: ${shadows.md};
    transform: translateY(-1px);
  }
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing.lg};
`;

const StatCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  text-align: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: ${shadows.md};
    transform: translateY(-2px);
  }
`;

const StatNumber = styled.div`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
  margin-bottom: ${spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[600]};
  font-weight: ${typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.full};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  margin-bottom: ${spacing.md};
  
  ${props => props.isValid ? `
    background: ${colors.success}20;
    color: ${colors.success};
    border: 1px solid ${colors.success}40;
  ` : `
    background: ${colors.error}20;
    color: ${colors.error};
    border: 1px solid ${colors.error}40;
  `}
`;

const StatusIcon = styled.span`
  font-size: ${typography.fontSize.base};
`;

const Description = styled.div`
  color: ${colors.gray[700]};
  line-height: 1.6;
  font-size: ${typography.fontSize.sm};
`;

const RawDataSection = styled.details`
  margin-top: ${spacing.lg};
  padding: ${spacing.md};
  background: ${colors.gray[100]};
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.border};
  
  summary {
    cursor: pointer;
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.gray[700]};
    padding: ${spacing.sm};
    margin-bottom: ${spacing.sm};
    
    &:hover {
      color: ${colors.primary[600]};
    }
  }
`;

const CodeBlock = styled.pre`
  background: ${colors.gray[900]};
  color: ${colors.gray[100]};
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  overflow-x: auto;
  font-family: ${typography.fontFamily.mono.join(', ')};
  font-size: ${typography.fontSize.sm};
  margin: ${spacing.sm} 0 0 0;
  border: 1px solid ${colors.gray[700]};
  white-space: pre-wrap;
`;

const ModalFooter = styled.div`
  padding: ${spacing.lg} ${spacing.xl};
  border-top: 1px solid ${colors.border};
  background: ${colors.gray[50]};
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.md};
  flex-shrink: 0;
  min-height: 70px;
  align-items: center;
  
  @media (max-width: 640px) {
    padding: ${spacing.md};
    flex-direction: column-reverse;
    gap: ${spacing.sm};
    
    button {
      width: 100%;
    }
  }
`;

const Button = styled.button`
  padding: ${spacing.sm} ${spacing.lg};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid ${colors.border};
  
  ${props => props.primary ? `
    background: ${colors.primary[500]};
    color: white;
    border-color: ${colors.primary[500]};
    
    &:hover {
      background: ${colors.primary[600]};
      border-color: ${colors.primary[600]};
      transform: translateY(-1px);
      box-shadow: ${shadows.md};
    }
  ` : `
    background: ${colors.surface};
    color: ${colors.gray[700]};
    
    &:hover {
      background: ${colors.gray[50]};
      transform: translateY(-1px);
    }
  `}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

export const ResultsModal = ({ isOpen, onClose, results, isError = false }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  if (isError) {
    return (
      <ModalOverlay onClick={handleOverlayClick}>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>
              <span>❌</span>
              Pipeline Analysis Failed
            </ModalTitle>
            <CloseButton onClick={onClose}>×</CloseButton>
          </ModalHeader>
          
          <ModalBody>
            <ResultCard>
              <StatusBadge isValid={false}>
                <StatusIcon>❌</StatusIcon>
                Pipeline Analysis Failed
              </StatusBadge>
              <Description>
                <strong>Error Details:</strong><br/>
                {results?.message || 'An unexpected error occurred while processing your pipeline.'}<br/><br/>
                
                <strong>Expected Response Format:</strong><br/>
                • <strong>num_nodes:</strong> (integer) - Number of nodes in pipeline<br/>
                • <strong>num_edges:</strong> (integer) - Number of edges in pipeline<br/>
                • <strong>is_dag:</strong> (boolean) - Whether pipeline forms a valid DAG<br/><br/>
                
                Please check your pipeline structure and try again. Ensure all nodes are properly configured and connections are valid.
              </Description>
            </ResultCard>
          </ModalBody>
          
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
            <Button primary onClick={onClose}>Try Again</Button>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            <span>📊</span>
            Pipeline Analysis Results
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <ResultGrid>
            <StatCard>
              <StatNumber>{results?.num_nodes || 0}</StatNumber>
              <StatLabel>Number of Nodes</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>{results?.num_edges || 0}</StatNumber>
              <StatLabel>Number of Edges</StatLabel>
            </StatCard>
          </ResultGrid>
          
          <ResultCard>
            <StatusBadge isValid={results?.is_dag}>
              <StatusIcon>{results?.is_dag ? '✅' : '❌'}</StatusIcon>
              {results?.is_dag ? 'Valid DAG Structure' : 'Invalid - Contains Cycles'}
            </StatusBadge>
            
            <Description>
              <strong>Pipeline Analysis Summary:</strong><br/>
              • <strong>num_nodes:</strong> {results?.num_nodes || 0}<br/>
              • <strong>num_edges:</strong> {results?.num_edges || 0}<br/>
              • <strong>is_dag:</strong> {results?.is_dag ? 'true' : 'false'}<br/><br/>
              
              {results?.is_dag 
                ? '✅ Your pipeline forms a valid Directed Acyclic Graph (DAG). This means there are no cycles in your pipeline, and data can flow through it without getting stuck in infinite loops. The pipeline structure is valid for execution.'
                : '❌ Your pipeline contains cycles, which means it does NOT form a valid Directed Acyclic Graph (DAG). This could cause data to get stuck in infinite loops. Please review your node connections to remove any circular dependencies.'
              }
            </Description>
          </ResultCard>
          
          {results?.num_nodes === 0 && (
            <ResultCard>
              <StatusBadge isValid={false}>
                <StatusIcon>ℹ️</StatusIcon>
                Empty Pipeline
              </StatusBadge>
              <Description>
                Your pipeline is empty (0 nodes, 0 edges). Add some nodes from the toolbar above and connect them to create a data processing workflow, then submit again for analysis.
              </Description>
            </ResultCard>
          )}
          
          {results && results.num_nodes > 0 && results.num_edges === 0 && (
            <ResultCard>
              <StatusBadge isValid={true}>
                <StatusIcon>ℹ️</StatusIcon>
                Disconnected Nodes
              </StatusBadge>
              <Description>
                Your pipeline has {results.num_nodes} node(s) but no connections (edges). While this technically forms a valid DAG, you may want to connect your nodes to create a meaningful data flow.
              </Description>
            </ResultCard>
          )}
          
          {results && !isError && (
            <RawDataSection>
              <summary>📋 View Raw Response Data (As Per Assessment Requirements)</summary>
              <CodeBlock>
                {JSON.stringify({
                  num_nodes: results.num_nodes,
                  num_edges: results.num_edges,
                  is_dag: results.is_dag
                }, null, 2)}
              </CodeBlock>
            </RawDataSection>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
          <Button primary onClick={onClose}>Continue Editing</Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};