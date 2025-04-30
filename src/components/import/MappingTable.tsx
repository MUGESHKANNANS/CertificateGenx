import React, { useState } from 'react';
import { ArrowLeft, Save, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ColumnMapping } from '../../types';

interface MappingTableProps {
  headers: string[];
  onBack: () => void;
}

const MappingTable: React.FC<MappingTableProps> = ({ headers, onBack }) => {
  const { 
    excelData, 
    columnMappings, 
    updateColumnMapping, 
    currentPreviewIndex,
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');

  const commonPlaceholders = [
    'name',
    'date',
    'course',
    'instructor',
    'achievement',
    'title',
    'grade',
    'completion',
    'email',
    'id',
  ];

  const handleMappingChange = (index: number, placeholderField: string) => {
    const mapping: ColumnMapping = {
      excelColumn: columnMappings[index].excelColumn,
      placeholderField,
    };
    updateColumnMapping(index, mapping);
  };

  const filteredMappings = columnMappings.filter(mapping => 
    mapping.excelColumn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.placeholderField.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
            onClick={onBack}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">Map Excel Columns</h2>
        </div>
        <div className="text-sm text-gray-600">
          {excelData.length} rows loaded
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search columns..."
          className="w-full pl-10 pr-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Excel Column
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Certificate Placeholder
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMappings.map((mapping, index) => (
              <tr key={mapping.excelColumn}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {mapping.excelColumn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {excelData[currentPreviewIndex] && 
                   String(excelData[currentPreviewIndex][mapping.excelColumn] || '').substring(0, 30)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="relative">
                    <select
                      value={mapping.placeholderField}
                      onChange={(e) => handleMappingChange(index, e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">-- Select placeholder --</option>
                      {commonPlaceholders.map((placeholder) => (
                        <option key={placeholder} value={placeholder}>
                          {placeholder}
                        </option>
                      ))}
                      <option value="_custom">Custom placeholder...</option>
                    </select>
                    {mapping.placeholderField && (
                      <div className="mt-1 text-xs text-blue-600">
                        Use {`{${mapping.placeholderField}}`} in text elements
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-sm text-blue-700">
        <p className="font-medium mb-1">Mapping Instructions</p>
        <p className="text-xs">
          1. Match each Excel column with the corresponding certificate placeholder field
        </p>
        <p className="text-xs">
          2. These placeholders can be used in text elements by including {'{placeholder}'} in your text
        </p>
        <p className="text-xs">
          3. You can also add placeholder elements directly to your canvas
        </p>
      </div>
    </div>
  );
};

export default MappingTable;