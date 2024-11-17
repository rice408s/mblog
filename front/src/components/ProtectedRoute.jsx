import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';
import PropTypes from 'prop-types';

export function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* 装饰线 */}
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
          
          <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm p-8 rounded-lg">
            <p className="text-white/60 font-mono mb-4">需要登录后访问</p>
            <Navigate to="/login" replace />
          </div>
        </div>
      </div>
    );
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
}; 