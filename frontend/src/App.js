import styled from 'styled-components';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { colors, spacing } from './styles/constants';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${spacing.md};
  gap: ${spacing.md};
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
`;

const Header = styled.header`
  background: linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 50%, ${colors.primary[800]} 100%);
  border-bottom: 1px solid ${colors.primary[700]};
  padding: ${spacing.xl} ${spacing.xl};
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: shimmer 8s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes shimmer {
    0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.3; }
    50% { transform: rotate(180deg) scale(1.1); opacity: 0.1; }
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.25rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  letter-spacing: -0.025em;
`;

const Subtitle = styled.p`
  margin: ${spacing.sm} 0 0 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  font-weight: 400;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <Title>VectorShift Pipeline Builder</Title>
        <Subtitle>Create and manage your data processing pipelines</Subtitle>
      </Header>
      
      <MainContent>
        <PipelineToolbar />
        <PipelineUI />
      </MainContent>
      
      <SubmitButton />
    </AppContainer>
  );
}

export default App;
