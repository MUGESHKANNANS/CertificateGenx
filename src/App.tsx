import React from 'react';
import Editor from './pages/Editor';
import { CanvasProvider } from './context/CanvasContext';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <CanvasProvider>
      <DataProvider>
        <Editor />
      </DataProvider>
    </CanvasProvider>
  );
}

export default App;