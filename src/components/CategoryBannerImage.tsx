import React, { useState } from 'react';

interface CategoryBannerImageProps {
  src: string;
  alt: string;
  onLoad?: () => void;
}

/**
 * Optimized category banner image with sharp rendering
 * - Uses backdrop-filter for crisp edges
 * - Lazy loading for performance
 * - Proper image loading states
 */
export const CategoryBannerImage: React.FC<CategoryBannerImageProps> = ({
  src,
  alt,
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      {/* Loading state - subtle placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />
      )}

      {/* Main image - sharp rendering */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        onError={() => {
          setError(true);
          setIsLoaded(true);
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          imageRendering: 'crisp-edges',
          filter: 'contrast(1.1) brightness(0.95)',
          willChange: 'transform',
        }}
      />

      {/* Fallback if image fails to load */}
      {error && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Image non disponible</div>
        </div>
      )}
    </>
  );
};
