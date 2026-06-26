import React, { useState } from 'react';
import FloatingButton from './FloatingButton';
import Sidebar from './Sidebar';

interface AppProps {
  type: 'repo' | 'profile';
  owner: string;
  repo?: string;
}

const App: React.FC<AppProps> = ({ type, owner, repo }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const buttonLabel = type === 'profile' ? 'Analyze Portfolio' : 'Start Mock Interview';

  return (
    <div className="font-sans antialiased text-slate-200">
      {/* Floating Button - Visible when sidebar is closed */}
      {!isOpen && (
        <FloatingButton 
          onClick={toggleSidebar} 
          label={buttonLabel} 
        />
      )}

      {/* Sidebar Panel - Slides in/out */}
      <Sidebar 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        owner={owner} 
        repo={repo || ''} 
        type={type}
      />
    </div>
  );
};

export default App;
