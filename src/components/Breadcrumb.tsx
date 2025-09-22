import React from 'react';
import { ChevronRight } from 'lucide-react';

const Breadcrumb: React.FC = () => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {/* This is a clickable link to the home page */}
      <span className="hover:text-blue-600 cursor-pointer">Início</span>

      {/* The separator icon (self-closing tag) */}
      <ChevronRight className="h-4 w-4" />

      {/* The current page text (not clickable) */}
      <span className="font-semibold text-gray-900">Desmobilização</span>
    </nav>
  );
};

export default Breadcrumb;