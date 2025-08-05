import React, { useState } from 'react';
import { X, Edit, Trash2, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LogEntry } from '../App';
import { toast } from 'sonner@2.0.3';

interface DetailPanelProps {
  log: LogEntry;
  editMode: boolean;
  onEdit: () => void;
  onClose: () => void;
  onSave: (log: LogEntry) => void;
  onDelete: () => void;
  onCopy: () => void;
}

export function DetailPanel({ log, editMode, onEdit, onClose, onSave, onDelete, onCopy }: DetailPanelProps) {
  const [formData, setFormData] = useState(log);

  const handleInputChange = (field: keyof LogEntry, value: string) => {
    // Apply field length restrictions for fixed-length fields
    let processedValue = value;
    switch (field) {
      case 'subsystem':
        processedValue = value.slice(0, 2).toUpperCase();
        break;
      case 'composite':
      case 'program':
      case 'abendCode':
      case 'jobname':
        processedValue = value.slice(0, 8).toUpperCase();
        break;
      case 'logNumber':
        processedValue = value.slice(0, 4);
        break;
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleSave = () => {
    onSave(formData);
    toast('Log updated successfully');
  };

  const handleDelete = () => {
    const result = window.confirm(
      `Are you sure you want to delete this log entry?\n\nLog: ${log.subsystem}-${log.program}-${log.abendCode}\nCreated: ${formatTimestamp(log.timestamp)}\n\nThis action cannot be undone.`
    );
    if (result) {
      onDelete();
    }
  };

  const handleCopy = () => {
    onCopy();
    toast('Redirecting to create new log with copied data...');
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      
      {/* Panel - 85% width */}
      <div className="relative w-[85%] bg-bg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color bg-surface">
          <div className="flex-1">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-text-sub mb-2">
              <span className="font-mono">{log.subsystem}</span>
              <span className="mx-2">▸</span>
              <span className="font-mono">{log.program}</span>
              <span className="mx-2">▸</span>
              <span className="font-mono">{log.abendCode}</span>
              <span className="mx-2">▸</span>
              <span className="font-mono">#{log.logNumber}</span>
            </div>
            <h2 className="font-medium text-text">Log Details</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {!editMode && (
              <>
                <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy this log">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDelete} className="hover:bg-red-100 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto max-h-[calc(100vh-140px)]">
          <div className="p-6">
            {editMode ? (
              /* Edit Mode */
              <div className="space-y-6">
                {/* Basic Info - Side by Side */}
                <div className="bg-surface p-6 rounded-lg">
                  <h4 className="font-medium text-text mb-4">Basic Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="edit-subsystem">Subsystem (2)</Label>
                      <Input
                        id="edit-subsystem"
                        value={formData.subsystem}
                        onChange={(e) => handleInputChange('subsystem', e.target.value)}
                        maxLength={2}
                        className="mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-composite">Composite (8)</Label>
                      <Input
                        id="edit-composite"
                        value={formData.composite}
                        onChange={(e) => handleInputChange('composite', e.target.value)}
                        maxLength={8}
                        className="mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-program">Program (8)</Label>
                      <Input
                        id="edit-program"
                        value={formData.program}
                        onChange={(e) => handleInputChange('program', e.target.value)}
                        maxLength={8}
                        className="mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-abendCode">Abend Code (8)</Label>
                      <Input
                        id="edit-abendCode"
                        value={formData.abendCode}
                        onChange={(e) => handleInputChange('abendCode', e.target.value)}
                        maxLength={8}
                        className="mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-jobname">Job Name (8)</Label>
                      <Input
                        id="edit-jobname"
                        value={formData.jobname}
                        onChange={(e) => handleInputChange('jobname', e.target.value)}
                        maxLength={8}
                        className="mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-logNumber">Log Number (4)</Label>
                      <Input
                        id="edit-logNumber"
                        value={formData.logNumber}
                        onChange={(e) => handleInputChange('logNumber', e.target.value)}
                        maxLength={4}
                        className="mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value as LogEntry['category'])}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="User">User</SelectItem>
                          <SelectItem value="JCL">JCL</SelectItem>
                          <SelectItem value="System">System</SelectItem>
                          <SelectItem value="Program">Program</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-createdBy">Created By</Label>
                      <Input
                        id="edit-createdBy"
                        value={formData.createdBy}
                        onChange={(e) => handleInputChange('createdBy', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Combined Detail Fields - All in One Box */}
                <div className="bg-surface p-6 rounded-lg">
                  <h4 className="font-medium text-text mb-4">Detailed Analysis</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-problem">Problem</Label>
                      <Textarea
                        id="edit-problem"
                        value={formData.problem}
                        onChange={(e) => handleInputChange('problem', e.target.value)}
                        rows={3}
                        className="mt-1"
                        placeholder="Describe the problem..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-resolution">Resolution</Label>
                      <Textarea
                        id="edit-resolution"
                        value={formData.resolution}
                        onChange={(e) => handleInputChange('resolution', e.target.value)}
                        rows={3}
                        className="mt-1"
                        placeholder="How was it resolved..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-recovery">Recovery</Label>
                      <Textarea
                        id="edit-recovery"
                        value={formData.recovery}
                        onChange={(e) => handleInputChange('recovery', e.target.value)}
                        rows={3}
                        className="mt-1"
                        placeholder="Recovery actions taken..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-results">Results</Label>
                      <Textarea
                        id="edit-results"
                        value={formData.results}
                        onChange={(e) => handleInputChange('results', e.target.value)}
                        rows={3}
                        className="mt-1"
                        placeholder="Results of the actions..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-prevention">Prevention</Label>
                      <Textarea
                        id="edit-prevention"
                        value={formData.prevention}
                        onChange={(e) => handleInputChange('prevention', e.target.value)}
                        rows={3}
                        className="mt-1"
                        placeholder="How to prevent in future..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Read-Only Mode */
              <div className="space-y-6">
                {/* Basic Info - Side by Side */}
                <div className="bg-surface p-6 rounded-lg">
                  <h4 className="font-medium text-text mb-4">Basic Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-text-sub">Subsystem</div>
                      <div className="font-medium font-mono">{log.subsystem}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-sub">Composite</div>
                      <div className="font-medium font-mono">{log.composite}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-sub">Program</div>
                      <div className="font-medium font-mono">{log.program}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-sub">Abend Code</div>
                      <div className="font-medium font-mono">{log.abendCode}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-sub">Job Name</div>
                      <div className="font-medium font-mono">{log.jobname}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-sub">Log Number</div>
                      <div className="font-medium font-mono">{log.logNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-sub">Category</div>
                      <div className="font-medium">{log.category}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-sub">Timestamp</div>
                      <div className="font-medium">{formatTimestamp(log.timestamp)}</div>
                    </div>
                    <div className="col-span-2 md:col-span-4">
                      <div className="text-sm text-text-sub">Created By</div>
                      <div className="font-medium">{log.createdBy}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-text-sub">Description</div>
                    <div className="text-sm text-text mt-1">{log.description}</div>
                  </div>
                </div>

                {/* Combined Detailed Information - All in One Box */}
                <div className="bg-surface p-6 rounded-lg">
                  <h4 className="font-medium text-text mb-4">Detailed Analysis</h4>
                  <div className="space-y-4">
                    {log.problem && (
                      <div>
                        <div className="text-sm font-medium text-text-sub mb-1">Problem</div>
                        <div className="text-sm bg-bg p-3 rounded-sm font-mono border">
                          {log.problem}
                        </div>
                      </div>
                    )}

                    {log.resolution && (
                      <div>
                        <div className="text-sm font-medium text-text-sub mb-1">Resolution</div>
                        <div className="text-sm bg-bg p-3 rounded-sm font-mono border">
                          {log.resolution}
                        </div>
                      </div>
                    )}

                    {log.recovery && (
                      <div>
                        <div className="text-sm font-medium text-text-sub mb-1">Recovery</div>
                        <div className="text-sm bg-bg p-3 rounded-sm font-mono border">
                          {log.recovery}
                        </div>
                      </div>
                    )}

                    {log.results && (
                      <div>
                        <div className="text-sm font-medium text-text-sub mb-1">Results</div>
                        <div className="text-sm bg-bg p-3 rounded-sm font-mono border">
                          {log.results}
                        </div>
                      </div>
                    )}

                    {log.prevention && (
                      <div>
                        <div className="text-sm font-medium text-text-sub mb-1">Prevention</div>
                        <div className="text-sm bg-bg p-3 rounded-sm font-mono border">
                          {log.prevention}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Mode Footer */}
        {editMode && (
          <div className="border-t border-border-color bg-bg p-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary text-primary-fg hover:bg-primary/90">
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}