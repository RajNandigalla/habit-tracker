import React from 'react';
import { Modal, Button } from '../../core';
import { ShieldCheck, Lock, Database, Smartphone } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
      <div className="space-y-6">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">
              Your Data Stays With You
            </h4>
            <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed">
              We believe your habits and journal entries are private. That's why this app is built
              as a <strong>Local-First</strong> application.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-white">Local Storage</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                All your data (habits, logs, settings) is stored securely on your device's browser
                storage (LocalStorage). We do not have a central database.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-white">No Tracking</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We do not track your usage, sell your data, or use analytics cookies. You are
                completely anonymous.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-white">Data Control</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You can export your data to a JSON file at any time for backup or to move it to
                another device. You can also wipe all data instantly from the Settings.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Understood
          </Button>
        </div>
      </div>
    </Modal>
  );
};
