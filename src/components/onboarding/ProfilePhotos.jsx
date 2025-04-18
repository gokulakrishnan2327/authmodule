import React, { useState, useRef, useEffect } from 'react';

const ProfilePhotos = ({ photo, onChange }) => {
  // Internal state for managing multiple photos
  const [photos, setPhotos] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  
  const MAX_PHOTOS = 3;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  
  const [errors, setErrors] = useState([]);
  
  // Initialize photos array if a single photo is passed
  useEffect(() => {
    if (photo && !Array.isArray(photo)) {
      // If we get a single File object, convert to our internal format
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos([{
          id: `photo-${Date.now()}-0`,
          url: e.target.result,
          name: photo.name,
          file: photo
        }]);
      };
      reader.readAsDataURL(photo);
    } else if (Array.isArray(photos) && photos.length === 0 && Array.isArray(photo) && photo.length > 0) {
      // If photos array is passed directly
      setPhotos(photo);
    }
  }, [photo]);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
  };
  
  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only JPEG, PNG, and GIF images are allowed.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 5MB limit.";
    }
    return null;
  };
  
  const processFiles = (files) => {
    const newErrors = [];
    const newPhotos = [...photos];
    
    Array.from(files).forEach(file => {
      if (newPhotos.length >= MAX_PHOTOS) {
        newErrors.push(`Maximum of ${MAX_PHOTOS} photos allowed.`);
        return;
      }
      
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
        return;
      }
      
      // Read file and create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: `photo-${Date.now()}-${newPhotos.length}`,
          url: e.target.result,
          name: file.name,
          file: file
        };
        
        const updatedPhotos = [...newPhotos, newPhoto];
        setPhotos(updatedPhotos);
        
        // Send only the first file to parent component
        // This aligns with the expected single photo in the parent
        onChange(updatedPhotos[0].file);
      };
      reader.readAsDataURL(file);
    });
    
    setErrors(newErrors);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };
  
  const handleFileInputChange = (e) => {
    processFiles(e.target.files);
    // Reset the input so the same file can be selected again if removed
    e.target.value = null;
  };
  
  const handleRemovePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    setPhotos(updatedPhotos);
    
    // If all photos are removed, send null to parent
    if (updatedPhotos.length === 0) {
      onChange(null);
    } else {
      // Otherwise send the first photo
      onChange(updatedPhotos[0].file);
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Upload Profile Photo</h3>
      <p className="text-gray-600 mb-6">
        Upload a profile photo. This helps build trust with other users on the platform.
        A photo is optional but recommended.
      </p>
      
      {/* Error messages */}
      {errors.length > 0 && (
        <div className="mb-4">
          {errors.map((error, index) => (
            <div key={index} className="text-red-600 text-sm mb-1">
              {error}
            </div>
          ))}
        </div>
      )}
      
      {/* Drag & drop area */}
      <div 
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6
          ${dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop image here, or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-500">
          JPEG, PNG, GIF up to 5MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>
      
      {/* Preview area */}
      {photos && photos.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="relative">
              <img 
                src={photo.url} 
                alt={photo.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                onClick={() => handleRemovePhoto(photo.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          
          {/* Empty slots - only show if less than MAX_PHOTOS */}
          {photos && Array.from({ length: MAX_PHOTOS - photos.length }).map((_, index) => (
            <div 
              key={`empty-${index}`} 
              className="border border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-gray-400 text-sm">Add photo</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePhotos;