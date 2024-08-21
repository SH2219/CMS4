import React, { useContext } from 'react';
import { LanguageContext } from '../LanguageContext';

const Header = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);

  return (
    <header className="bg-slate-800 text-white p-4 shadow-md flex items-center justify-between">
      <div className="text-xl font-bold">
        My Website
      </div>
      <button
        onClick={toggleLanguage}
        className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
      >
        {language}
      </button>
    </header>
  );
};

export default Header;
