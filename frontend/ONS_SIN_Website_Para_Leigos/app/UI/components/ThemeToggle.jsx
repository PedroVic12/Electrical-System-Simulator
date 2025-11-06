'use client'

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Efeito para carregar o tema salvo ou detectar preferência do sistema
  useEffect(() => {
    // Verifica se há um tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // Se houver tema salvo, aplica-o
      setIsDark(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Caso contrário, verifica a preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Função para alternar entre os temas
  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    
    // Atualiza o estado e o atributo data-theme
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.toggle('dark', isDark);

    // Salva a preferência no localStorage
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className="theme-icon sun" size={16} />
      <label className="theme-switch">
        <input 
          type="checkbox" 
          checked={isDark}
          onChange={toggleTheme}
          aria-label="Alternar tema"
        />
        <span className="theme-slider"></span>
      </label>
      <Moon className="theme-icon moon" size={16} />
    </div>
  );
}
