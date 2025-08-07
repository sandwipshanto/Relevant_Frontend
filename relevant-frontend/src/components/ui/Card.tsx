import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-2xl overflow-hidden';
  
  const variants = {
    default: `
      bg-white border border-gray-100 shadow-sm
      transition-all duration-300 hover:shadow-md
    `,
    elevated: `
      bg-white border border-gray-100 shadow-lg
      transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1
    `,
    glass: `
      bg-white/80 backdrop-blur-md border border-white/20
      shadow-lg transition-all duration-300 hover:shadow-xl
    `,
    interactive: `
      bg-white border border-gray-100 shadow-sm cursor-pointer
      transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]
      active:scale-[0.98]
    `,
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${paddings[padding]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`pb-4 border-b border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  as: Component = 'h3',
  className = '',
  ...props
}) => {
  const baseClasses = 'font-bold text-gray-900 leading-tight';
  
  const sizeClasses = {
    h1: 'text-3xl lg:text-4xl',
    h2: 'text-2xl lg:text-3xl',
    h3: 'text-xl lg:text-2xl',
    h4: 'text-lg lg:text-xl',
    h5: 'text-base lg:text-lg',
    h6: 'text-sm lg:text-base',
  };

  const classes = `${baseClasses} ${sizeClasses[Component]} ${className}`;

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`text-gray-600 leading-relaxed ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`pt-4 border-t border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
};
