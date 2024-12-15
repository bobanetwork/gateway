import React, { useEffect, useState } from 'react';

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Text } from '@/components/ui';
import { ModalConfig } from '@/types/modal';
import clsx from 'clsx';

interface ModalProps {
  config: ModalConfig;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ config, isOpen }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    if (config.onClose) {
      config.onClose();
    }
  };

  return mounted ? (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[420px]" onClose={handleClose}>
        <DialogHeader>
          <div className="flex flex-col items-start justify-between gap-2">
            <DialogTitle
              className={clsx(
                "flex items-center",
                `${config.titleStack ? 'flex-col gap-2 items-start' : 'gap-2'}`
              )}>
              {config.icon &&
                <div className="p-1 border-2 border-green-300 bg-green-50 dark:bg-dark-green-500  rounded-full text-green-400 dark:text-dark-green-300">
                  {config.icon}</div>}
              <Text variant="lg" fontFamily="montserrat" >{config.title}</Text>
            </DialogTitle>
            {config.subtitle && <Text variant="sm" className="text-muted-foreground">{config.subtitle}</Text>}
          </div>
        </DialogHeader>

        <DialogDescription className="py-4">{config.content}</DialogDescription>

        {config.actions && (
          <DialogFooter className="flex gap-2">
            {config.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                onClick={action.onClick}
                className="w-full rounded-full"
                size="md"
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