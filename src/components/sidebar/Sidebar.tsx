import React, { useState } from 'react';
import { 
  PanelRight, 
  Type, 
  Image, 
  Square, 
  Layers, 
  Upload, 
  Tag, 
  BookTemplate 
} from 'lucide-react';
import ElementsPanel from './ElementsPanel';
import TextPanel from './TextPanel';
import UploadsPanel from './UploadsPanel';
import TemplatesPanel from './TemplatesPanel';
import LayersPanel from './LayersPanel';
import PlaceholderPanel from './PlaceholderPanel';
import { useCanvas } from '../../context/CanvasContext';

type Tab = 'elements' | 'text' | 'uploads' | 'templates' | 'layers' | 'placeholder';

const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('elements');
  const [collapsed, setCollapsed] = useState(false);
  const { selectedElement } = useCanvas();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderPanel = () => {
    switch (activeTab) {
      case 'elements':
        return <ElementsPanel />;
      case 'text':
        if (selectedElement?.type === 'text') {
          return <TextPanel element={selectedElement} />;
        }
        return <TextPanel />;
      case 'placeholder':
        if (selectedElement?.type === 'placeholder') {
          return <PlaceholderPanel element={selectedElement} />;
        }
        return <PlaceholderPanel />;
      case 'uploads':
        return <UploadsPanel />;
      case 'templates':
        return <TemplatesPanel />;
      case 'layers':
        return <LayersPanel />;
      default:
        return <ElementsPanel />;
    }
  };

  // Switch to placeholder tab when a placeholder element is selected
  React.useEffect(() => {
    if (selectedElement?.type === 'placeholder') {
      setActiveTab('placeholder');
    }
  }, [selectedElement]);

  if (collapsed) {
    return (
      <div className="bg-white border-l border-gray-200 h-full flex flex-col w-12">
        <button
          className="p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={toggleSidebar}
        >
          <PanelRight size={20} />
        </button>
        <div className="flex flex-col flex-1 items-center pt-4">
          {renderCollapsedTabs()}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-l border-gray-200 h-full flex flex-col w-64">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">Elements</h2>
        <button
          className="text-gray-500 hover:text-gray-900 transition-colors"
          onClick={toggleSidebar}
        >
          <PanelRight size={20} />
        </button>
      </div>
      <div className="flex border-b border-gray-200">
        {renderTabs()}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {renderPanel()}
      </div>
    </div>
  );

  function renderTabs() {
    const tabs: { id: Tab; icon: JSX.Element; label: string }[] = [
      { id: 'elements', icon: <Square size={18} />, label: 'Elements' },
      { id: 'text', icon: <Type size={18} />, label: 'Text' },
      { id: 'uploads', icon: <Upload size={18} />, label: 'Uploads' },
      { id: 'templates', icon: <BookTemplate size={18} />, label: 'Templates' },
      { id: 'layers', icon: <Layers size={18} />, label: 'Layers' },
    ];

    if (selectedElement?.type === 'placeholder') {
      tabs.push({ id: 'placeholder', icon: <Tag size={18} />, label: 'Placeholder' });
    }

    return tabs.map((tab) => (
      <button
        key={tab.id}
        className={`flex-1 py-2 text-xs font-medium transition-colors flex flex-col items-center justify-center
          ${
            activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        onClick={() => setActiveTab(tab.id)}
      >
        {tab.icon}
        <span className="mt-1">{tab.label}</span>
      </button>
    ));
  }

  function renderCollapsedTabs() {
    const tabs: { id: Tab; icon: JSX.Element }[] = [
      { id: 'elements', icon: <Square size={20} /> },
      { id: 'text', icon: <Type size={20} /> },
      { id: 'uploads', icon: <Upload size={20} /> },
      { id: 'templates', icon: <BookTemplate size={20} /> },
      { id: 'layers', icon: <Layers size={20} /> },
    ];

    if (selectedElement?.type === 'placeholder') {
      tabs.push({ id: 'placeholder', icon: <Tag size={20} /> });
    }

    return tabs.map((tab) => (
      <button
        key={tab.id}
        className={`p-2 mb-2 rounded-md transition-colors
          ${
            activeTab === tab.id
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        onClick={() => {
          setActiveTab(tab.id);
          setCollapsed(false);
        }}
      >
        {tab.icon}
      </button>
    ));
  }
};

export default Sidebar;