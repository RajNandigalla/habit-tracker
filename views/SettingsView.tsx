import React, { useState, useRef } from 'react';
import { Card, Switch, Button, SettingsRow, ConfirmationModal } from '../core';
import {
  CloudIcon,
  MoonIcon,
  BellIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  ChevronRightIcon,
  DownloadIcon,
  UploadIcon,
  FireIcon,
  TrashIcon,
} from '../icons';
import { UserPreferences } from '../types';
import { cn } from '../utils';
import { PageTitle } from '../modules/PageTitle';
import PageTransition from '../core/PageTransition';
import { ActionRow } from '../modules/settings';

interface SettingsViewProps {
  preferences: UserPreferences;
  onToggleDarkMode: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
  onPopulateTestData: () => void;
  onClearAllData: () => void;
  onPrivacyPolicy: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onToggleDarkMode,
  onExportData,
  onImportData,
  onPopulateTestData,
  onClearAllData,
  onPrivacyPolicy,
}) => {
  const [cloudSync, setCloudSync] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
    isDanger: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    onConfirm: () => {},
    isDanger: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportData(file);
    }
    // Reset value to allow selecting same file again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePopulateWrapper = () => {
    setConfirmation({
      isOpen: true,
      title: 'Populate with Test Data',
      message:
        'This will replace all your current habits and journal entries with sample data. Are you sure you want to proceed?',
      confirmLabel: 'Populate Data',
      isDanger: true,
      onConfirm: () => {
        onPopulateTestData();
        setConfirmation(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleClearWrapper = () => {
    setConfirmation({
      isOpen: true,
      title: 'Start Fresh',
      message:
        'This will permanently delete all your habits, journal entries, and history. This action cannot be undone.',
      confirmLabel: 'Clear All Data',
      isDanger: true,
      onConfirm: () => {
        onClearAllData();
        setConfirmation(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <PageTransition>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24 md:pb-8">
          <PageTitle
            title="Settings"
            description="Configure app preferences, manage data, and connect services."
            className="mb-8"
          />

          <div className="grid grid-cols-1 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Data & Storage */}
              <section>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                  Data & Storage
                </h2>
                <Card className="p-0 overflow-hidden">
                  <div className="p-4 space-y-1">
                    <SettingsRow
                      icon={CloudIcon}
                      title="Automatic Cloud Backup"
                      description="Securely backup your habits and journal entries to the cloud."
                    >
                      <Switch checked={cloudSync} onChange={setCloudSync} />
                    </SettingsRow>
                  </div>
                </Card>
              </section>

              {/* App Preferences */}
              <section>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                  Preferences
                </h2>
                <Card className="space-y-1">
                  <SettingsRow
                    icon={MoonIcon}
                    title="Dark Mode"
                    description="Adjust the appearance for low light."
                  >
                    <Switch checked={preferences.darkMode} onChange={onToggleDarkMode} />
                  </SettingsRow>

                  <div className="border-t border-slate-100 dark:border-slate-700/50 my-1"></div>

                  <SettingsRow
                    icon={BellIcon}
                    title="Daily Reminders"
                    description="Get notified at 9:00 AM daily."
                  >
                    <Switch checked={notifications} onChange={setNotifications} />
                  </SettingsRow>
                </Card>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Data Management */}
              <section>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                  Data Management
                </h2>
                <Card className="space-y-4">
                  <div className="flex flex-col gap-4 p-2">
                    <Button
                      variant="secondary"
                      className="flex-1 justify-between"
                      onClick={onExportData}
                      rightIcon={
                        <DownloadIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      }
                    >
                      Export Data (JSON)
                    </Button>
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button
                        variant="secondary"
                        className="w-full justify-between"
                        rightIcon={
                          <UploadIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        }
                      >
                        Import Data (JSON)
                      </Button>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Support & About */}
              <section>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                  Support
                </h2>
                <Card className="space-y-1 divide-y divide-slate-100 dark:divide-slate-700/50">
                  <button
                    onClick={onPrivacyPolicy}
                    className="w-full flex items-center justify-between py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                        <ShieldCheckIcon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        Privacy Policy
                      </span>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 text-slate-400" />
                  </button>
                  <div className="w-full flex items-center justify-between py-3 px-2 -mx-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                        <SmartphoneIcon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        App Version
                      </span>
                    </div>
                    <span className="text-sm text-slate-400">v1.2.0 (Local)</span>
                  </div>
                </Card>
              </section>

              {/* Danger Zone */}
              <section>
                <h2 className="text-base font-semibold text-red-600 dark:text-red-400 mb-2 px-2">
                  Danger Zone
                </h2>
                <div className="bg-red-50 dark:bg-red-900/10 rounded-xl shadow-sm px-4 border border-red-200 dark:border-red-500/20 divide-y divide-red-200 dark:divide-red-500/20">
                  <ActionRow
                    icon={FireIcon}
                    title="Populate with Test Data"
                    description="Overwrite all existing data."
                    buttonText="Populate"
                    onClick={handlePopulateWrapper}
                    isDanger={true}
                    isLoading={false}
                  />
                  <ActionRow
                    icon={TrashIcon}
                    title="Start Fresh"
                    description="Clear all data irrevocably."
                    buttonText="Clear Data"
                    onClick={handleClearWrapper}
                    isDanger={true}
                    isLoading={false}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
        title={confirmation.title}
        message={confirmation.message}
        confirmLabel={confirmation.confirmLabel}
        onConfirm={confirmation.onConfirm}
        isDanger={confirmation.isDanger}
      />
    </PageTransition>
  );
};
