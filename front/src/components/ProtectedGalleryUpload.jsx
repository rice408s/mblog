import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { GalleryUpload } from '../pages/GalleryUpload';

export function ProtectedGalleryUpload() {
  const location = useLocation();
  const password = document.cookie
    .split('; ')
    .find(row => row.startsWith('admin_password='));

  if (!password) {
    return <Navigate to="/login" state={location.pathname} replace />;
  }

  return <GalleryUpload />;
} 