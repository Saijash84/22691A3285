import React, { createContext, useContext, ReactNode } from 'react';
import { loggerService, LogEntry } from '../services/loggerService';

interface LoggerContextType {
  info: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  error: (message: string, data?: any) => void;
  getLogs: () => LogEntry[];
  clearLogs: () => void;
}

const LoggerContext = createContext<LoggerContextType | undefined>(undefined);

interface LoggerProviderProps {
  children: ReactNode;
}

export const LoggerProvider: React.FC<LoggerProviderProps> = ({ children }) => {
  const value: LoggerContextType = {
    info: (message: string, data?: any) => {
      loggerService.info(message, data);
    },
    warn: (message: string, data?: any) => {
      loggerService.warn(message, data);
    },
    error: (message: string, data?: any) => {
      loggerService.error(message, data);
    },
    getLogs: () => {
      return loggerService.getLogs();
    },
    clearLogs: () => {
      loggerService.clearLogs();
    }
  };

  return (
    <LoggerContext.Provider value={value}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = (): LoggerContextType => {
  const context = useContext(LoggerContext);
  if (context === undefined) {
    throw new Error('useLogger must be used within a LoggerProvider');
  }
  return context;
}; 