import React, { useState, useMemo } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Layout } from './Layout';
import { LogEntry, View } from '../App';
import { toast } from 'sonner@2.0.3';

interface ScanResultsProps {
  logs: LogEntry[];
  onNavigate: (view: View) => void;
  onViewLog: (log: LogEntry) => void;
  onDeleteLog: (logId: string) => void;
}

export function ScanResults({ logs, onNavigate, onViewLog, onDeleteLog }: ScanResultsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [columnFilters, setColumnFilters] = useState({
    subsystem: '',
    composite: '',
    program: '',
    abendCode: '',
    jobname: '',
    date: '',
    logNumber: '',
    category: '',
    description: '',
    createdBy: ''
  });

  // Move formatTimestamp function before it's used
  const formatTimestamp = (date: Date) => {
    const year = date.getFullYear().toString().slice(-4);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesGlobalSearch = searchQuery === '' || 
        Object.values(log).some(value => 
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );

      const logDate = formatTimestamp(log.timestamp);

      const matchesColumnFilters = 
        (columnFilters.subsystem === '' || log.subsystem.toLowerCase().includes(columnFilters.subsystem.toLowerCase())) &&
        (columnFilters.composite === '' || log.composite.toLowerCase().includes(columnFilters.composite.toLowerCase())) &&
        (columnFilters.program === '' || log.program.toLowerCase().includes(columnFilters.program.toLowerCase())) &&
        (columnFilters.abendCode === '' || log.abendCode.toLowerCase().includes(columnFilters.abendCode.toLowerCase())) &&
        (columnFilters.jobname === '' || log.jobname.toLowerCase().includes(columnFilters.jobname.toLowerCase())) &&
        (columnFilters.date === '' || logDate.includes(columnFilters.date)) &&
        (columnFilters.logNumber === '' || log.logNumber.includes(columnFilters.logNumber)) &&
        (columnFilters.category === '' || log.category.toLowerCase().includes(columnFilters.category.toLowerCase())) &&
        (columnFilters.description === '' || log.description.toLowerCase().includes(columnFilters.description.toLowerCase())) &&
        (columnFilters.createdBy === '' || log.createdBy.toLowerCase().includes(columnFilters.createdBy.toLowerCase()));

      return matchesGlobalSearch && matchesColumnFilters;
    });
  }, [logs, searchQuery, columnFilters, formatTimestamp]);

  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [column]: value }));
  };

  const getCategoryColor = (category: LogEntry['category']) => {
    switch (category) {
      case 'User': return 'bg-blue-100 text-blue-800';
      case 'JCL': return 'bg-green-100 text-green-800';
      case 'System': return 'bg-red-100 text-red-800';
      case 'Program': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (e: React.MouseEvent, logId: string) => {
    e.stopPropagation();
    const result = window.confirm('Are you sure you want to delete this log entry?\n\nThis action cannot be undone.');
    if (result) {
      onDeleteLog(logId);
      toast('Log entry deleted successfully');
    }
  };

  return (
    <Layout currentView="scan" onNavigate={onNavigate}>
      {/* Global Search */}
      <div className="bg-surface border-b border-border-color p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-sub" />
              <Input
                placeholder="Global search across all fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredLogs.length} results
          </Badge>
        </div>
      </div>

      {/* Results Table with Column Filters */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          <table className="w-full">
            {/* Column Headers */}
            <thead className="bg-surface border-b border-border-color sticky top-0">
              <tr>
                <th className="text-left p-3 font-medium text-text text-sm w-16">Sub</th>
                <th className="text-left p-3 font-medium text-text text-sm w-24">Composite</th>
                <th className="text-left p-3 font-medium text-text text-sm w-24">Program</th>
                <th className="text-left p-3 font-medium text-text text-sm w-24">Abend</th>
                <th className="text-left p-3 font-medium text-text text-sm w-24">Job</th>
                <th className="text-left p-3 font-medium text-text text-sm w-20">Date</th>
                <th className="text-left p-3 font-medium text-text text-sm w-16">Log#</th>
                <th className="text-left p-3 font-medium text-text text-sm w-20">Category</th>
                <th className="text-left p-3 font-medium text-text text-sm flex-1">Description</th>
                <th className="text-left p-3 font-medium text-text text-sm w-32">Created By</th>
                <th className="text-left p-3 font-medium text-text text-sm w-16">Actions</th>
              </tr>
            </thead>
            
            {/* Column Filters */}
            <thead className="bg-surface border-b border-border-color sticky top-12">
              <tr>
                <th className="p-2">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.subsystem}
                    onChange={(e) => handleColumnFilterChange('subsystem', e.target.value)}
                    className="text-xs h-8"
                  />
                </th>
                <th className="p-2">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.composite}
                    onChange={(e) => handleColumnFilterChange('composite', e.target.value)}
                    className="text-xs h-8"
                  />
                </th>
                <th className="p-2">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.program}
                    onChange={(e) => handleColumnFilterChange('program', e.target.value)}
                    className="text-xs h-8"
                  />
                </th>
                <th className="p-2">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.abendCode}
                    onChange={(e) => handleColumnFilterChange('abendCode', e.target.value)}
                    className="text-xs h-8"
                  />
                </th>
                <th className="p-2">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.jobname}
                    onChange={(e) => handleColumnFilterChange('jobname', e.target.value)}
                    className="text-xs h-8"
                  />
                </th>
                <th className="p-2">
                  <Input
                    placeholder="YYYYMMDD"
                    value={columnFilters.date}
                    onChange={(e) => handleColumnFilterChange('date', e.target.value)}
                    className="text-xs h-8"
                  />
                </th>
                <th className="p-2">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.logNumber}
                    onChange={(e) => handleColumnFilterChange('logNumber', e.target.value)}
                    className="text-xs h-8"
                  />
                </th>
                <th className="p-2">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.category}
                    onChange={(e) => handleColumnFilterChange('category', e.target.value)}
                    className="text-xs h-8"
                  />
                </th>
                <th className="p-2">
                  <Input
                    placeholder="Filter description..."
                    value={columnFilters.description}
                    onChange={(e) => handleColumnFilterChange('description', e.target.value)}
                    className="text-xs h-8"
                  />
                </th>
                <th className="p-2">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.createdBy}
                    onChange={(e) => handleColumnFilterChange('createdBy', e.target.value)}
                    className="text-xs h-8"
                  />
                </th>
                <th className="p-2"></th>
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className={`h-12 border-b border-border-color cursor-pointer hover:bg-primary/5 ${
                    index % 2 === 1 ? 'bg-surface' : 'bg-bg'
                  }`}
                  onClick={() => onViewLog(log)}
                >
                  <td className="p-3 text-sm font-mono text-text">{log.subsystem}</td>
                  <td className="p-3 text-sm font-mono text-text">{log.composite}</td>
                  <td className="p-3 text-sm font-mono text-text">{log.program}</td>
                  <td className="p-3 text-sm font-mono text-text">{log.abendCode}</td>
                  <td className="p-3 text-sm font-mono text-text">{log.jobname}</td>
                  <td className="p-3 text-sm font-mono text-text-sub">{formatTimestamp(log.timestamp)}</td>
                  <td className="p-3 text-sm font-mono text-text">{log.logNumber}</td>
                  <td className="p-3">
                    <Badge 
                      className={`text-xs px-2 py-0.5 ${getCategoryColor(log.category)}`}
                      style={{ borderRadius: `${4}px` }}
                    >
                      {log.category}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-text max-w-xs truncate">{log.description}</td>
                  <td className="p-3 text-sm text-text-sub truncate max-w-32">{log.createdBy}</td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDelete(e, log.id)}
                      className="p-1 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-sub">No logs found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}