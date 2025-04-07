import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { createContentItem, updateContentItem } from '@/lib/strapiSecond/api';
import { StrapiImage } from './ContentGrid';

// Types for dynamic zones
interface ColumnContent {
  title?: string;
  content?: string;
  image?: StrapiImage;
}

interface TwoColumnsComponent {
  __component: 'layouts.two-columns';
  leftColumn?: ColumnContent;
  rightColumn?: ColumnContent;
}

interface FullWidthComponent {
  __component: 'layouts.full-width';
  title?: string;
  content?: string;
  image?: StrapiImage;
}

interface ImageTextComponent {
  __component: 'layouts.image-text';
  image?: StrapiImage;
  text?: string;
  imagePosition?: 'left' | 'right';
}

// Union type for all possible dynamic zone components
type DynamicZoneComponent = TwoColumnsComponent | FullWidthComponent | ImageTextComponent;

// Form data interface
interface ContentFormData {
  title: string;
  description: string;
  image: File | null;
  dynamicZone: DynamicZoneComponent[];
  [key: string]: any;
}

interface DynamicFormProps {
  contentType: string;
  initialData?: ContentFormData;
  itemId?: string | number;
  onSuccess?: (data: any) => void;
}

export default function DynamicForm({ 
  contentType, 
  initialData, 
  itemId, 
  onSuccess 
}: DynamicFormProps) {
  // Initialize form data
  const [formData, setFormData] = useState<ContentFormData>(initialData || {
    title: '',
    description: '',
    image: null,
    dynamicZone: []
  });
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeComponentIndex, setActiveComponentIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle basic field changes
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new dynamic component
  const handleAddComponent = (type: string) => {
    let newComponent: DynamicZoneComponent;
    
    if (type === 'layouts.two-columns') {
      newComponent = {
        __component: 'layouts.two-columns',
        leftColumn: { title: '', content: '' },
        rightColumn: { title: '', content: '' }
      };
    } else if (type === 'layouts.full-width') {
      newComponent = {
        __component: 'layouts.full-width',
        title: '',
        content: ''
      };
    } else if (type === 'layouts.image-text') {
      newComponent = {
        __component: 'layouts.image-text',
        text: '',
        imagePosition: 'left'
      };
    } else {
      return; // Unknown component type
    }
    
    setFormData(prev => ({
      ...prev,
      dynamicZone: [...prev.dynamicZone, newComponent]
    }));
    
    // Set the newly added component as active
    setActiveComponentIndex(formData.dynamicZone.length);
  };

  // Update a dynamic component
  const handleComponentUpdate = (index: number, updatedComponent: DynamicZoneComponent) => {
    setFormData(prev => {
      const newDynamicZone = [...prev.dynamicZone];
      newDynamicZone[index] = updatedComponent;
      return { ...prev, dynamicZone: newDynamicZone };
    });
  };

  // Remove a dynamic component
  const handleRemoveComponent = (index: number) => {
    setFormData(prev => {
      const newDynamicZone = prev.dynamicZone.filter((_, i) => i !== index);
      return { ...prev, dynamicZone: newDynamicZone };
    });
    
    if (activeComponentIndex === index) {
      setActiveComponentIndex(null);
    } else if (activeComponentIndex !== null && activeComponentIndex > index) {
      setActiveComponentIndex(activeComponentIndex - 1);
    }
  };

  // Move a component up in the list
  const handleMoveUp = (index: number) => {
    if (index === 0) return; // Already at the top
    
    setFormData(prev => {
      const newDynamicZone = [...prev.dynamicZone];
      const temp = newDynamicZone[index];
      newDynamicZone[index] = newDynamicZone[index - 1];
      newDynamicZone[index - 1] = temp;
      return { ...prev, dynamicZone: newDynamicZone };
    });
    
    if (activeComponentIndex === index) {
      setActiveComponentIndex(index - 1);
    } else if (activeComponentIndex === index - 1) {
      setActiveComponentIndex(index);
    }
  };

  // Move a component down in the list
  const handleMoveDown = (index: number) => {
    if (index === formData.dynamicZone.length - 1) return; // Already at the bottom
    
    setFormData(prev => {
      const newDynamicZone = [...prev.dynamicZone];
      const temp = newDynamicZone[index];
      newDynamicZone[index] = newDynamicZone[index + 1];
      newDynamicZone[index + 1] = temp;
      return { ...prev, dynamicZone: newDynamicZone };
    });
    
    if (activeComponentIndex === index) {
      setActiveComponentIndex(index + 1);
    } else if (activeComponentIndex === index + 1) {
      setActiveComponentIndex(index);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Prepare form data for API
      const apiData = {
        title: formData.title,
        description: formData.description,
        dynamicZone: formData.dynamicZone
      };
      
      // Handle file upload and content creation/update separately
      // This is a simplified approach - in a real app you'd use FormData for files
      
      let result;
      if (itemId) {
        // Update existing item
        result = await updateContentItem(contentType, itemId, apiData);
      } else {
        // Create new item
        result = await createContentItem(contentType, apiData);
      }
      
      // TODO: Handle image upload after content is created
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Failed to save content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render component editor based on type
  const renderComponentEditor = (component: DynamicZoneComponent, index: number) => {
    if (component.__component === 'layouts.two-columns') {
      const typedComponent = component as TwoColumnsComponent;
      return (
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-bold mb-4">Two Columns Layout</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="border p-3 rounded">
              <h4 className="font-semibold mb-2">Left Column</h4>
              <div className="mb-3">
                <label className="block text-sm mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={typedComponent.leftColumn?.title || ''}
                  onChange={(e) => {
                    const updatedComponent = {
                      ...typedComponent,
                      leftColumn: {
                        ...typedComponent.leftColumn,
                        title: e.target.value
                      }
                    };
                    handleComponentUpdate(index, updatedComponent);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Content</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  value={typedComponent.leftColumn?.content || ''}
                  onChange={(e) => {
                    const updatedComponent = {
                      ...typedComponent,
                      leftColumn: {
                        ...typedComponent.leftColumn,
                        content: e.target.value
                      }
                    };
                    handleComponentUpdate(index, updatedComponent);
                  }}
                />
              </div>
              {/* TODO: Add image upload for left column */}
            </div>
            
            {/* Right Column */}
            <div className="border p-3 rounded">
              <h4 className="font-semibold mb-2">Right Column</h4>
              <div className="mb-3">
                <label className="block text-sm mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={typedComponent.rightColumn?.title || ''}
                  onChange={(e) => {
                    const updatedComponent = {
                      ...typedComponent,
                      rightColumn: {
                        ...typedComponent.rightColumn,
                        title: e.target.value
                      }
                    };
                    handleComponentUpdate(index, updatedComponent);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Content</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  value={typedComponent.rightColumn?.content || ''}
                  onChange={(e) => {