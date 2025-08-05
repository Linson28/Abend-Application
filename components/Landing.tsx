import React from 'react';
import { ArrowRight, Plus, Search } from 'lucide-react';
import { View } from '../App';

interface LandingProps {
  onNavigate: (view: View) => void;
}

export function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-[880px] mx-auto">
        {/* Centered 12-col grid container */}
        <div className="grid grid-cols-12 gap-6">
          {/* Hero Section */}
          <div className="col-span-12 text-center mb-12">
            <h1 className="text-2xl font-medium text-text mb-4">Abend Log</h1>
            <p className="text-lg text-text-sub">
              Track, analyze, and resolve system abends efficiently
            </p>
          </div>

          {/* CTA Cards */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Add Log Card */}
            <div 
              className="w-72 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:border-primary hover:-translate-y-0.5 group"
              onClick={() => onNavigate('add-log')}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface mb-3 group-hover:bg-primary/10">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-text mb-1">Add New Log</h3>
              <p className="text-sm text-text-sub text-center px-4">
                Document a new abend incident
              </p>
              <ArrowRight className="w-5 h-5 text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Scan Logs Card */}
            <div 
              className="w-72 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:border-primary hover:-translate-y-0.5 group"
              onClick={() => onNavigate('scan')}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface mb-3 group-hover:bg-primary/10">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-text mb-1">Search Logs</h3>
              <p className="text-sm text-text-sub text-center px-4">
                Find and analyze existing logs
              </p>
              <ArrowRight className="w-5 h-5 text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}