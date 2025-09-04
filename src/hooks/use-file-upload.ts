'use client';

import { useCallback, useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface FileUploadItem {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface UseFileUploadOptions {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  maxFiles?: number;
  initialFiles?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
}

export interface UseFileUploadState {
  files: FileUploadItem[];
  isDragging: boolean;
  errors: string[];
  isUploading: boolean;
}

export interface UseFileUploadActions {
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  openFileDialog: () => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  getInputProps: () => object;
  uploadToSupabase: (
    file: File,
    isEdit?: boolean,
    existingUrl?: string
  ) => Promise<string>;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / k ** i).toFixed(dm)) + ' ' + sizes[i];
}

export function useFileUpload(
  options: UseFileUploadOptions = {}
): [UseFileUploadState, UseFileUploadActions] {
  const {
    accept = 'image/*',
    maxSize = 5 * 1024 * 1024, // 5MB
    multiple = false,
    maxFiles = 1,
    initialFiles = [],
  } = options;

  const [files, setFiles] = useState<FileUploadItem[]>(() => {
    return initialFiles.map(file => ({
      id: file.id,
      file: new File([], file.name, { type: file.type }),
      preview: file.url,
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.url,
    }));
  });

  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `File ${file.name} is too large. Maximum size is ${formatBytes(maxSize)}.`;
      }

      if (
        accept &&
        !accept.split(',').some(type => {
          const trimmedType = type.trim();
          if (trimmedType.endsWith('/*')) {
            return file.type.startsWith(trimmedType.slice(0, -1));
          }
          return file.type === trimmedType;
        })
      ) {
        return `File ${file.name} is not an accepted file type.`;
      }

      return null;
    },
    [accept, maxSize]
  );

  const processFiles = useCallback(
    (fileList: File[]) => {
      const newErrors: string[] = [];
      const validFiles: FileUploadItem[] = [];

      // Check max files limit
      if (files.length + fileList.length > maxFiles) {
        newErrors.push(
          `Cannot upload more than ${maxFiles} file${maxFiles > 1 ? 's' : ''}.`
        );
        setErrors(newErrors);
        return;
      }

      fileList.forEach(file => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
        } else {
          const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2)}`;
          const preview = URL.createObjectURL(file);

          validFiles.push({
            id,
            file,
            preview,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        }
      });

      setErrors(newErrors);

      if (validFiles.length > 0) {
        setFiles(prev => (multiple ? [...prev, ...validFiles] : validFiles));
      }
    },
    [files.length, maxFiles, multiple, validateFile]
  );

  const uploadToSupabase = useCallback(
    async (
      file: File,
      isEdit: boolean = false,
      existingUrl?: string
    ): Promise<string> => {
      setIsUploading(true);
      try {
        const supabase = createClient();

        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
        const filePath = `post-images/${fileName}`;

        // Get file type
        const contentType = file.type || 'image/jpeg';

        // Upload options with proper typing
        const uploadOptions = {
          contentType,
          upsert: false,
        };

        // If editing, use upsert to replace existing file
        if (isEdit && existingUrl) {
          // Extract filename from existing URL if it's a Supabase URL
          const existingPath = existingUrl.includes('post-images/')
            ? existingUrl.split('post-images/')[1].split('?')[0]
            : null;

          if (existingPath) {
            uploadOptions.upsert = true;
            // Use existing file path for upsert
            const { error } = await supabase.storage
              .from('post-images')
              .upload(`post-images/${existingPath}`, file, uploadOptions);

            if (error) throw error;

            // Get public URL
            const { data: urlData } = supabase.storage
              .from('post-images')
              .getPublicUrl(`post-images/${existingPath}`);

            return urlData.publicUrl;
          }
        }

        // Upload new file
        const { error } = await supabase.storage
          .from('post-images')
          .upload(filePath, file, uploadOptions);

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);

        return urlData.publicUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [processFiles]
  );

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(file => file.id !== id);
      // Revoke object URL to prevent memory leaks
      const removedFile = prev.find(file => file.id === id);
      if (removedFile?.preview && removedFile.preview.startsWith('blob:')) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return updatedFiles;
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach(file => {
      if (file.preview && file.preview.startsWith('blob:')) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  }, [files]);

  const getInputProps = useCallback(
    () => ({
      ref: inputRef,
      type: 'file',
      accept,
      multiple,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        processFiles(selectedFiles);
        // Reset input value to allow selecting the same file again
        e.target.value = '';
      },
    }),
    [accept, multiple, processFiles]
  );

  return [
    { files, isDragging, errors, isUploading },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
      uploadToSupabase,
    },
  ];
}
