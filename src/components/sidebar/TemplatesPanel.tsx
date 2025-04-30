import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash } from 'lucide-react';
import { useCanvas } from '../../context/CanvasContext';
import { TemplateData } from '../../types';

const TemplatesPanel: React.FC = () => {
  const { elements, canvasSize, loadTemplate, clearCanvas } = useCanvas();
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [templateName, setTemplateName] = useState('');

  // Load templates from localStorage on first render
  useEffect(() => {
    const storedTemplates = localStorage.getItem('certificate-templates');
    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates));
    }
  }, []);

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    // Create thumbnail (placeholder for now)
    const thumbnail = 'https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&w=100';

    const newTemplate: TemplateData = {
      id: Date.now().toString(),
      name: templateName,
      elements: [...elements],
      canvasSize,
      thumbnail,
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('certificate-templates', JSON.stringify(updatedTemplates));
    setTemplateName('');
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter((template) => template.id !== id);
    setTemplates(updatedTemplates);
    localStorage.setItem('certificate-templates', JSON.stringify(updatedTemplates));
  };

  const handleLoadTemplate = (template: TemplateData) => {
    loadTemplate(template.elements, template.canvasSize);
  };

  const handleCreateNew = () => {
    clearCanvas();
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Save Template</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Template name"
            className="flex-1 p-2 border border-gray-300 rounded-md"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <button
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleSaveTemplate}
          >
            <Save size={20} />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Templates</h3>
        <button
          className="flex items-center justify-center w-full p-2 mb-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-600"
          onClick={handleCreateNew}
        >
          <Plus size={16} className="mr-1" />
          <span className="text-sm">Create New</span>
        </button>

        {templates.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-3">No saved templates</p>
        ) : (
          <div className="space-y-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-md overflow-hidden"
              >
                <div className="p-2 flex justify-between items-center">
                  <span className="text-sm font-medium">{template.name}</span>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
                <div
                  className="aspect-video bg-gray-100 relative cursor-pointer"
                  onClick={() => handleLoadTemplate(template)}
                >
                  {template.thumbnail && (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-medium text-transparent hover:text-white px-2 py-1 rounded bg-transparent hover:bg-black hover:bg-opacity-50 transition-colors">
                      Use Template
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPanel;