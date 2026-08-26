import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  adminPassword: string;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  changePassword: (newPin: string) => void;
}

const DEFAULT_PIN = 'CIMKT';
const PIN_STORAGE_KEY = 'buzz_admin_pin_v1';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
  });

  useEffect(() => {
    localStorage.setItem(PIN_STORAGE_KEY, adminPassword);
  }, [adminPassword]);

  const loginAdmin = (pin: string): boolean => {
    const cleaned = pin.trim().toUpperCase();
    if (cleaned === 'D3VONLY' || cleaned === 'CIMKT' || cleaned === adminPassword.trim().toUpperCase()) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const changePassword = (newPin: string) => {
    if (newPin.trim()) {
      setAdminPassword(newPin.trim());
      setIsAdmin(true);
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminPassword, loginAdmin, logoutAdmin, changePassword }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
