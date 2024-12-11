import React, { useEffect, useRef, useState } from 'react';

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Text } from '@/components/ui';
import { ModalConfig } from '@/types/modal';

interface ModalProps {
  config: ModalConfig;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ config, isOpen }) => {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (config.onClose) {
      config.onClose();
    }
  };

  return mounted ? (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[420px]" onClose={handleClose}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              {config.icon && <span>{config.icon}</span>}
              <Text variant="lg" fontFamily="montserrat" >{config.title}</Text>
            </DialogTitle>
          </div>
        </DialogHeader>

        <DialogDescription className="py-4">{config.content}</DialogDescription>

        {config.actions && (
          <DialogFooter className="flex justify-end gap-2">
            {config.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                onClick={action.onClick}
                className="w-full rounded-full"
              >
                {action.label}
              </Button>
            ))}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  ) : null;
};

export default Modal;