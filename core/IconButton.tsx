import React from 'react';
import { Button, ButtonProps } from './Button';
import { Tooltip, TooltipProps } from './Tooltip';
import { cn } from '../utils';

interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'fullWidth'> {
  /**
   * The icon to display.
   */
  icon: React.ReactNode;
  /**
   * Whether to make the button fully rounded (circular).
   * @default false
   */
  isRounded?: boolean;
  /**
   * Accessible label for the button.
   */
  'aria-label': string;
  /**
   * Optional tooltip text to display on hover.
   */
  tooltip?: string;
  /**
   * Position of the tooltip relative to the button.
   * @default 'top'
   */
  tooltipPosition?: TooltipProps['position'];
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  className,
  isRounded = false,
  size = 'icon',
  tooltip,
  tooltipPosition = 'top',
  children,
  ...props
}) => {
  // We cast props to any here because ButtonProps is a discriminated union
  // and efficiently passing separate props to a union type component usually requires
  // narrowing, but we just want to pass them through.
  // The 'as any' safe here because we know Button handles both variants.
  const button = (
    <Button
      className={cn('aspect-square', isRounded && 'rounded-full', className)}
      size={size}
      {...(props as any)}
    >
      {icon}
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} position={tooltipPosition}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default IconButton;
