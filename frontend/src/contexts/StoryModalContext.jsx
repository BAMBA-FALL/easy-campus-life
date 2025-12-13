import React, { createContext, useContext, useState } from 'react';

const StoryModalContext = createContext();

export const useStoryModal = () => {
  const context = useContext(StoryModalContext);
  if (!context) {
    throw new Error('useStoryModal must be used within a StoryModalProvider');
  }
  return context;
};

export const StoryModalProvider = ({ children }) => {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  return (
    <StoryModalContext.Provider value={{ isStoryModalOpen, setIsStoryModalOpen }}>
      {children}
    </StoryModalContext.Provider>
  );
};
