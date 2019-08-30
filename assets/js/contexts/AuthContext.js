import React from 'react';
// Permet de passer la valeur de isAuthenticated à tous les composants via le contexte
export default React.createContext({
    isAuthenticated: false,
    setIsAuthenticated: (value) => {}
});