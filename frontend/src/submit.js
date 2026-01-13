// submit.js

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, spacing, typography, borderRadius, shadows } from './styles/constants';
import { useStore } from './store';
import { submitPipeline } from './utils/api';
import { ResultsModal } from './components/ResultsModal';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 ${colors.primary[400]}40;
  }
  70% {
    box-shadow: 0 0 0 10px ${colors.primary[400]}00;
  }
  100% {
    box-shadow: 0 0 0 0 ${colors.primary[400]}00;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SubmitContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
  background: linear-gradient(135deg, ${colors.surface} 0%, ${colors.gray[50]} 100%);
  border-top: 1px solid ${colors.border};
  box-shadow: 0 -4px 20px 0 rgba(0, 0, 0, 0.05);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, ${colors.primary[300]} 50%, transparent 100%);
  }
`;

const StyledSubmitButton = styled.button`
  background: linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 50%, ${colors.primary[700]} 100%);
  color: white;
  border: none;
  border-radius: ${borderRadius.xl};
  padding: ${spacing.lg} ${spacing.xl};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.bold};
  font-family: ${typography.fontFamily.sans.join(', ')};
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 50%, ${colors.primary[800]} 100%);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    animation: ${pulse} 2s infinite;
  }

  &:disabled {
    background: linear-gradient(135deg, ${colors.gray[400]} 0%, ${colors.gray[500]} 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: ${shadows.sm};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
    pointer-events: none;
  }
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 1;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s ease-in-out infinite;
`;

const StatusMessage = styled.div`
  margin-left: ${spacing.md};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  
  &.success {
    background: ${colors.success}20;
    color: ${colors.success};
    border: 1px solid ${colors.success}40;
  }
  
  &.error {
    background: ${colors.error}20;
    color: ${colors.error};
    border: 1px solid ${colors.error}40;
  }
`;

export const SubmitButton = () => {
    const { nodes, edges } = useStore((state) => ({
        nodes: state.nodes,
        edges: state.edges,
    }));
    
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalResults, setModalResults] = useState(null);
    const [modalError, setModalError] = useState(false);

    const handleSubmit = async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        setStatus(null);
        
        try {
            // Prepare pipeline data
            const pipelineData = {
                nodes: nodes.map(node => ({
                    id: node.id,
                    type: node.type,
                    position: node.position,
                    data: node.data || {}
                })),
                edges: edges.map(edge => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    sourceHandle: edge.sourceHandle,
                    targetHandle: edge.targetHandle
                }))
            };

            console.log('Submitting pipeline:', pipelineData);

            // Submit to backend
            const response = await submitPipeline(pipelineData);
            
            console.log('Pipeline analysis result:', response);

            // Show results in modal
            setModalResults(response);
            setModalError(false);
            setModalOpen(true);
            setStatus({ type: 'success', message: 'Pipeline analyzed successfully!' });

        } catch (error) {
            console.error('Pipeline submission failed:', error);
            
            // Show error in modal
            setModalResults({ message: error.message });
            setModalError(true);
            setModalOpen(true);
            setStatus({ type: 'error', message: 'Submission failed. Please try again.' });
        } finally {
            setIsLoading(false);
            
            // Clear status after 5 seconds
            setTimeout(() => setStatus(null), 5000);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalResults(null);
        setModalError(false);
    };

    const isDisabled = isLoading || nodes.length === 0;

    return (
        <>
            <SubmitContainer>
                <StyledSubmitButton 
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    type="button"
                >
                    {isLoading && <LoadingSpinner />}
                    <ButtonText>
                        {isLoading ? 'Analyzing...' : 'Submit Pipeline'}
                    </ButtonText>
                </StyledSubmitButton>
                
                {status && (
                    <StatusMessage className={status.type}>
                        {status.message}
                    </StatusMessage>
                )}
            </SubmitContainer>

            <ResultsModal
                isOpen={modalOpen}
                onClose={closeModal}
                results={modalResults}
                isError={modalError}
            />
        </>
    );
};
