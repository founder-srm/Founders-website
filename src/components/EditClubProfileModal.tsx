'use client';

import { Building2, Camera, Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import {
  updateClubProfilePicture,
  uploadClubImage,
} from '@/actions/club/action';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EditClubProfileModalProps {
  clubId: string;
  clubName: string;
  currentPicture: string | null;
  onUpdate?: (newUrl: string) => void;
}

export function EditClubProfileModal({
  clubId,
  clubName,
  currentPicture,
  onUpdate,
}: EditClubProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(
        'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.'
      );
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { url, error: uploadError } = await uploadClubImage(
        clubId,
        formData
      );

      if (uploadError || !url) {
        setError(uploadError || 'Failed to upload image');
        setIsUploading(false);
        return;
      }

      // Update club profile picture in database
      const { error: updateError } = await updateClubProfilePicture(
        clubId,
        url
      );

      if (updateError) {
        setError(updateError);
        setIsUploading(false);
        return;
      }

      // Call onUpdate callback
      onUpdate?.(url);

      // Reset and close
      setIsOpen(false);
      setPreview(null);
      setFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setPreview(null);
    setFile(null);
    setError(null);
  };

  const handleRemovePreview = () => {
    setPreview(null);
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full border-2 border-background flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md cursor-pointer"
          aria-label="Edit profile picture"
        >
          <Camera className="w-4 h-4 text-primary-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new profile picture for {clubName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Preview Area */}
          <div className="flex justify-center">
            <div className="relative">
              {preview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 rounded-xl object-cover border-4 border-border shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePreview}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4 text-destructive-foreground" />
                  </button>
                </div>
              ) : currentPicture ? (
                <Image
                  src={currentPicture}
                  alt={clubName}
                  width={128}
                  height={128}
                  className="rounded-xl border-4 border-border shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-xl border-4 border-border shadow-lg bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-primary-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex flex-col items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              className="hidden"
              id="profile-upload"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {preview ? 'Choose Different Image' : 'Select Image'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              JPEG, PNG, WebP, or GIF. Max 5MB.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
