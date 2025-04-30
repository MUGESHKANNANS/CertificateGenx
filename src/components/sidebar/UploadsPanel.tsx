import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useCanvas } from '../../context/CanvasContext';
import { ImageElement } from '../../types';

const UploadsPanel: React.FC = () => {
  const { addElement, canvasSize } = useCanvas();
  const [isUploading, setIsUploading] = useState(false);
  
  const sampleImages = [
    {
      id: '1',
      src: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Landscape',
    },
    {
      id: '2',
      src: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Certificate Background',
    },
    {
      id: '3',
      src: 'https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Trophy',
    },
    {
      id: '4',
      src: 'https://images.pexels.com/photos/5428833/pexels-photo-5428833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Seal',
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        const element: ImageElement = {
          id: uuidv4(),
          type: 'image',
          x: canvasSize.width / 2 - 100,
          y: canvasSize.height / 2 - 100,
          width: 200,
          height: 200,
          rotation: 0,
          selected: false,
          src: event.target.result,
          opacity: 1,
          zIndex: 1,
        };
        addElement(element);
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSampleImageClick = (src: string) => {
    const element: ImageElement = {
      id: uuidv4(),
      type: 'image',
      x: canvasSize.width / 2 - 100,
      y: canvasSize.height / 2 - 100,
      width: 200,
      height: 200,
      rotation: 0,
      selected: false,
      src,
      opacity: 1,
      zIndex: 1,
    };
    addElement(element);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Upload Image</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload size={24} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Click to upload or drag an image</span>
            <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</span>
          </label>
          {isUploading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: '60%' }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1">Uploading...</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Images</h3>
        <div className="grid grid-cols-2 gap-2">
          {sampleImages.map((image) => (
            <div
              key={image.id}
              className="border border-gray-200 rounded-md overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => handleSampleImageClick(image.src)}
            >
              <div className="aspect-video bg-gray-100 relative">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-1 text-xs text-center truncate">{image.alt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadsPanel;