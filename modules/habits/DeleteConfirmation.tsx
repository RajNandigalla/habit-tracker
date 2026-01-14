import React from 'react';
import { Button } from '../../core';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  itemName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex gap-4 items-start border border-red-100 dark:border-red-800/50">
        <div className="p-3 bg-red-100 dark:bg-red-800/50 rounded-full text-red-600 dark:text-red-400 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-red-900 dark:text-red-100 mb-1">
            Are you absolutely sure?
          </h4>
          <p className="text-base text-red-700 dark:text-red-300 leading-relaxed">
            This will permanently delete <strong>{itemName}</strong> and remove all your progress
            history. This action cannot be undone.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Yes, Delete It
        </Button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
