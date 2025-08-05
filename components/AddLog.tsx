import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Layout } from './Layout';
import { LogEntry, View } from '../App';
import { toast } from 'sonner@2.0.3';

interface AddLogProps {
  onNavigate: (view: View) => void;
  onSave: (logData: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  copyData?: LogEntry;
}

export function AddLog({ onNavigate, onSave, copyData }: AddLogProps) {
  const [formData, setFormData] = useState({
    subsystem: '',
    composite: '',
    program: '',
    abendCode: '',
    jobname: '',
    logNumber: '',
    category: 'none' as LogEntry['category'] | 'none',
    description: '',
    problem: '',
    resolution: '',
    recovery: '',
    results: '',
    prevention: '',
    createdBy: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-populate form if copying from existing log
  useEffect(() => {
    if (copyData) {
      setFormData({
        subsystem: copyData.subsystem,
        composite: copyData.composite,
        program: copyData.program,
        abendCode: copyData.abendCode,
        jobname: copyData.jobname,
        logNumber: '', // Clear log number for new entry
        category: copyData.category,
        description: copyData.description,
        problem: copyData.problem,
        resolution: copyData.resolution,
        recovery: copyData.recovery,
        results: copyData.results,
        prevention: copyData.prevention,
        createdBy: copyData.createdBy
      });
    }
  }, [copyData]);

  const handleInputChange = (field: string, value: string) => {
    // Apply field length restrictions
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.subsystem) newErrors.subsystem = 'Subsystem is required (2 chars)';
    if (!formData.composite) newErrors.composite = 'Composite is required (max 8 chars)';
    if (!formData.program) newErrors.program = 'Program is required (max 8 chars)';
    if (!formData.abendCode) newErrors.abendCode = 'Abend code is required (max 8 chars)';
    if (!formData.jobname) newErrors.jobname = 'Job name is required (max 8 chars)';
    if (!formData.logNumber) newErrors.logNumber = 'Log number is required (4 chars)';
    if (formData.category === 'none') newErrors.category = 'Category is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.problem) newErrors.problem = 'Problem description is required';
    if (!formData.createdBy) newErrors.createdBy = 'Created by is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const { category, ...rest } = formData;
      onSave({ ...rest, category: category as LogEntry['category'] });
      toast(copyData ? 'Log copied and saved successfully' : 'Log saved successfully');
    }
  };

  const handleCancel = () => {
    onNavigate('landing');
  };

  return (
    <Layout currentView="add-log" onNavigate={onNavigate}>
      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-xl font-medium text-text mb-2">
              {copyData ? 'Copy Log Entry' : 'Add New Log Entry'}
            </h1>
            <p className="text-text-sub">
              {copyData ? 'Creating a new log based on existing entry' : 'Document a new abend incident with detailed information'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information - Side by Side */}
            <div className="bg-surface p-6 rounded-lg">
              <h3 className="font-medium text-text mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="subsystem">Subsystem (2)</Label>
                  <Input
                    id="subsystem"
                    value={formData.subsystem}
                    onChange={(e) => handleInputChange('subsystem', e.target.value)}
                    placeholder="CI"
                    maxLength={2}
                    className="mt-1 focus:shadow-default font-mono"
                  />
                  {errors.subsystem && (
                    <p className="text-sm text-red-600 mt-1">{errors.subsystem}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="composite">Composite (8)</Label>
                  <Input
                    id="composite"
                    value={formData.composite}
                    onChange={(e) => handleInputChange('composite', e.target.value)}
                    placeholder="PROD"
                    maxLength={8}
                    className="mt-1 focus:shadow-default font-mono"
                  />
                  {errors.composite && (
                    <p className="text-sm text-red-600 mt-1">{errors.composite}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="program">Program (8)</Label>
                  <Input
                    id="program"
                    value={formData.program}
                    onChange={(e) => handleInputChange('program', e.target.value)}
                    placeholder="CUSTMGR"
                    maxLength={8}
                    className="mt-1 focus:shadow-default font-mono"
                  />
                  {errors.program && (
                    <p className="text-sm text-red-600 mt-1">{errors.program}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="abendCode">Abend Code (8)</Label>
                  <Input
                    id="abendCode"
                    value={formData.abendCode}
                    onChange={(e) => handleInputChange('abendCode', e.target.value)}
                    placeholder="ASRA"
                    maxLength={8}
                    className="mt-1 focus:shadow-default font-mono"
                  />
                  {errors.abendCode && (
                    <p className="text-sm text-red-600 mt-1">{errors.abendCode}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="jobname">Job Name (8)</Label>
                  <Input
                    id="jobname"
                    value={formData.jobname}
                    onChange={(e) => handleInputChange('jobname', e.target.value)}
                    placeholder="BATCH01"
                    maxLength={8}
                    className="mt-1 focus:shadow-default font-mono"
                  />
                  {errors.jobname && (
                    <p className="text-sm text-red-600 mt-1">{errors.jobname}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="logNumber">Log Number (4)</Label>
                  <Input
                    id="logNumber"
                    value={formData.logNumber}
                    onChange={(e) => handleInputChange('logNumber', e.target.value)}
                    placeholder="0001"
                    maxLength={4}
                    className="mt-1 focus:shadow-default font-mono"
                  />
                  {errors.logNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.logNumber}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-1 focus:shadow-default">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" disabled>Select category</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="JCL">JCL</SelectItem>
                      <SelectItem value="System">System</SelectItem>
                      <SelectItem value="Program">Program</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="createdBy">Created By</Label>
                  <Input
                    id="createdBy"
                    value={formData.createdBy}
                    onChange={(e) => handleInputChange('createdBy', e.target.value)}
                    placeholder="Your name"
                    className="mt-1 focus:shadow-default"
                  />
                  {errors.createdBy && (
                    <p className="text-sm text-red-600 mt-1">{errors.createdBy}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the abend incident"
                  rows={2}
                  className="mt-1 focus:shadow-default"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Detailed Information - All in One Box */}
            <div className="bg-surface p-6 rounded-lg">
              <h3 className="font-medium text-text mb-4">Detailed Analysis</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="problem">Problem</Label>
                  <Textarea
                    id="problem"
                    value={formData.problem}
                    onChange={(e) => handleInputChange('problem', e.target.value)}
                    placeholder="Describe the problem that occurred..."
                    rows={3}
                    className="mt-1 focus:shadow-default"
                  />
                  {errors.problem && (
                    <p className="text-sm text-red-600 mt-1">{errors.problem}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="resolution">Resolution</Label>
                  <Textarea
                    id="resolution"
                    value={formData.resolution}
                    onChange={(e) => handleInputChange('resolution', e.target.value)}
                    placeholder="How was the problem resolved..."
                    rows={3}
                    className="mt-1 focus:shadow-default"
                  />
                </div>

                <div>
                  <Label htmlFor="recovery">Recovery</Label>
                  <Textarea
                    id="recovery"
                    value={formData.recovery}
                    onChange={(e) => handleInputChange('recovery', e.target.value)}
                    placeholder="What recovery actions were taken..."
                    rows={3}
                    className="mt-1 focus:shadow-default"
                  />
                </div>

                <div>
                  <Label htmlFor="results">Results</Label>
                  <Textarea
                    id="results"
                    value={formData.results}
                    onChange={(e) => handleInputChange('results', e.target.value)}
                    placeholder="What were the results of the resolution..."
                    rows={3}
                    className="mt-1 focus:shadow-default"
                  />
                </div>

                <div>
                  <Label htmlFor="prevention">Prevention</Label>
                  <Textarea
                    id="prevention"
                    value={formData.prevention}
                    onChange={(e) => handleInputChange('prevention', e.target.value)}
                    placeholder="How can this be prevented in the future..."
                    rows={3}
                    className="mt-1 focus:shadow-default"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="border-t border-border-color bg-bg p-4 flex justify-end gap-3">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={handleCancel}
          className="text-text-sub hover:text-text"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="bg-primary text-primary-fg hover:bg-primary/90"
          style={{ borderRadius: `${8}px` }}
        >
          {copyData ? 'Save Copy' : 'Save Log'}
        </Button>
      </div>
    </Layout>
  );
}