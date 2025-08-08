import React, { useState } from 'react';
import { Landing } from './components/Landing';
import { AddLog } from './components/AddLog';
import { ScanResults } from './components/ScanResults';
import { DetailPanel } from './components/DetailPanel';
import { Toaster } from './components/ui/sonner';

export type LogEntry = {
  id: string;
  subsystem: string; // max 2 chars
  composite: string; // max 8 chars
  program: string; // max 8 chars
  abendCode: string; // max 8 chars
  jobname: string; // max 8 chars
  logNumber: string; // max 4 chars
  category: 'User' | 'JCL' | 'System' | 'Program';
  timestamp: Date;
  description: string; // variable length, required
  problem: string;
  resolution: string;
  recovery: string;
  results: string;
  prevention: string;
  createdBy: string; // variable length
};

export type View = 'landing' | 'add-log' | 'scan';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [copyMode, setCopyMode] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      subsystem: 'CI',
      composite: 'PROD',
      program: 'CUSTMGR',
      abendCode: 'ASRA',
      jobname: 'BATCH01',
      logNumber: '0001',
      category: 'Program',
      timestamp: new Date('2024-12-15T14:30:00'),
      description: 'Customer data retrieval system experienced program protection exception during peak hours',
      problem: 'Program protection exception occurred during customer data retrieval.',
      resolution: 'Fixed array bounds checking in customer lookup routine.',
      recovery: 'Restarted CICS region after applying fix.',
      results: 'Customer transactions processing normally.',
      prevention: 'Added automated testing for array bounds in CI pipeline.',
      createdBy: 'John Doe'
    },
    {
      id: '2',
      subsystem: 'IM',
      composite: 'TEST',
      program: 'PAYROLL',
      abendCode: 'U0100',
      jobname: 'PAYROLL1',
      logNumber: '0002',
      category: 'User',
      timestamp: new Date('2024-12-14T09:15:00'),
      description: 'Payroll processing failure due to invalid employee ID format in test environment',
      problem: 'Invalid employee ID format causing processing failure.',
      resolution: 'Updated validation routine to handle new ID format.',
      recovery: 'Reprocessed failed transactions.',
      results: 'All payroll transactions completed successfully.',
      prevention: 'Enhanced input validation and error messaging.',
      createdBy: 'Jane Smith'
    },
    {
      id: '3',
      subsystem: 'DB',
      composite: 'PROD',
      program: 'INVMGMT',
      abendCode: 'SQL904',
      jobname: 'INVBATCH',
      logNumber: '0003',
      category: 'System',
      timestamp: new Date('2024-12-13T16:45:00'),
      description: 'Database tablespace unavailable causing inventory management batch job failure',
      problem: 'Unsuccessful resource allocation - tablespace unavailable.',
      resolution: 'Freed up tablespace by archiving old inventory records.',
      recovery: 'Restarted DB2 subsystem and reran batch job.',
      results: 'Inventory management batch completed successfully.',
      prevention: 'Implemented automated tablespace monitoring.',
      createdBy: 'Mike Johnson'
    }
  ]);

  const handleSaveLog = (logData: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...logData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setLogs(prev => [newLog, ...prev]);
    setCurrentView('scan');
    setCopyMode(false);
  };

  const handleUpdateLog = (updatedLog: LogEntry) => {
    setLogs(prev => prev.map(log => log.id === updatedLog.id ? updatedLog : log));
    setSelectedLog(updatedLog);
    setEditMode(false);
  };

  const handleDeleteLog = (logId: string) => {
    setLogs(prev => prev.filter(log => log.id !== logId));
    if (selectedLog && selectedLog.id === logId) {
      setSelectedLog(null);
      setEditMode(false);
    }
  };

  const handleCopyLog = (log: LogEntry) => {
    setSelectedLog(null);
    setEditMode(false);
    setCopyMode(true);
    setCurrentView('add-log');
  };

  const handleLoadLogs = async () => {
    try {
      const response = await fetch('/api/logs');
      const data = await response.json();
      const mapped: LogEntry[] = data.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
      setLogs(mapped);
    } catch (error) {
      console.error('Failed to load logs', error);
    }
  };

  const handleViewLog = (log: LogEntry) => {
    setSelectedLog(log);
    setEditMode(false);
    setCopyMode(false);
  };

  const handleEditLog = () => {
    setEditMode(true);
  };

  const handleCloseDetail = () => {
    setSelectedLog(null);
    setEditMode(false);
    setCopyMode(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing onNavigate={setCurrentView} />;
      case 'add-log':
        return <AddLog 
          onNavigate={setCurrentView} 
          onSave={handleSaveLog} 
          copyData={copyMode && selectedLog ? selectedLog : undefined}
        />;
      case 'scan':
        return <ScanResults
          logs={logs}
          onNavigate={setCurrentView}
          onViewLog={handleViewLog}
          onDeleteLog={handleDeleteLog}
          onLoadLogs={handleLoadLogs}
        />;
      default:
        return <Landing onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {renderCurrentView()}
      
      {selectedLog && !copyMode && (
        <DetailPanel
          log={selectedLog}
          editMode={editMode}
          onEdit={handleEditLog}
          onClose={handleCloseDetail}
          onSave={handleUpdateLog}
          onDelete={() => handleDeleteLog(selectedLog.id)}
          onCopy={() => handleCopyLog(selectedLog)}
        />
      )}
      
      <Toaster position="bottom-right" />
    </div>
  );
}