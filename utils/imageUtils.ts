import { Image as RNImage } from 'react-native';
import { PERFORMANCE } from './constants';

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Get image dimensions
 */
export const getImageDimensions = (
  imageUri: string
): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    RNImage.getSize(
      imageUri,
      (width, height) => {
        resolve({
          width,
          height,
          aspectRatio: width / height,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Calculate scaled dimensions while maintaining aspect ratio
 */
export const calculateScaledDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxDimension: number = PERFORMANCE.maxImageDimension
): ImageDimensions => {
  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      width = maxDimension;
      height = Math.round(maxDimension / aspectRatio);
    } else {
      height = maxDimension;
      width = Math.round(maxDimension * aspectRatio);
    }
  }

  return {
    width,
    height,
    aspectRatio,
  };
};

/**
 * Validate image dimensions for face detection
 */
export const isValidImageForFaceDetection = (
  dimensions: ImageDimensions
): boolean => {
  const minPixels = 100 * 100; // 100x100 minimum
  const maxPixels = 4096 * 4096; // 4096x4096 maximum

  const totalPixels = dimensions.width * dimensions.height;

  return totalPixels >= minPixels && totalPixels <= maxPixels;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Convert base64 to blob (web only)
 */
export const base64ToBlob = (base64: string, mimeType: string = 'image/jpeg'): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

/**
 * Generate thumbnail from image
 */
export const generateThumbnail = async (
  imageUri: string,
  maxDimension: number = 256
): Promise<string> => {
  const dimensions = await getImageDimensions(imageUri);
  const scaledDimensions = calculateScaledDimensions(
    dimensions.width,
    dimensions.height,
    maxDimension
  );

  // In a real app, would use image processing library
  // For MVP, return original URI
  return imageUri;
};

/**
 * Validate image quality
 */
export const validateImageQuality = (
  dimensions: ImageDimensions,
  minWidth: number = 640,
  minHeight: number = 480
): {
  valid: boolean;
  reason?: string;
} => {
  if (dimensions.width < minWidth) {
    return {
      valid: false,
      reason: `Image width ${dimensions.width}px is below minimum ${minWidth}px`,
    };
  }

  if (dimensions.height < minHeight) {
    return {
      valid: false,
      reason: `Image height ${dimensions.height}px is below minimum ${minHeight}px`,
    };
  }

  return { valid: true };
};
