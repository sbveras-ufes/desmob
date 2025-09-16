import React from 'react';
import { Menu, Bell, Users, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-blue-900 text-white shadow-lg relative">

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleMenu}
            className="h-6 w-6 cursor-pointer hover:text-gray-300 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>
      
      {/* Menu lateral */}
      {isMenuOpen && (
        <>
          {/* Overlay para fechar o menu */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMenu}
          />
          
          {/* Menu lateral */}
          <div className="fixed top-0 left-0 h-full w-80 bg-blue-900 text-white shadow-xl z-50 transform transition-transform duration-300">
            <div className="p-4 border-b border-blue-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button 
                  onClick={closeMenu}
                  className="h-6 w-6 cursor-pointer hover:text-gray-300 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <a 
                    href="#/" 
                    onClick={closeMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <Menu className="h-5 w-5" />
                    <span>Iniciar Desmobilização</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#/usuarios" 
                    onClick={closeMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span>Parametrização E-mail</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#/aprovacao" 
                    onClick={closeMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    <span>Consultar Aprovação</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;