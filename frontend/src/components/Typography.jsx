import { TEXT_STYLES } from '../constants/typography';

export function Heading({ level = 1, children, className = '', ...props }) {
  const Tag = `h${level}`;
  return (
    <Tag className={`${className}`} {...props}>
      {children}
    </Tag>
  );
}

export function Text({ variant = 'body', className = '', children, ...props }) {
  const style = TEXT_STYLES[variant] || TEXT_STYLES.body;
  const classes = `${className}`;
  
  return (
    <p 
      className={classes}
      style={{
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
      }}
      {...props}
    >
      {children}
    </p>
  );
}

export function Lead({ children, className = '', ...props }) {
  return (
    <p className={`lead ${className}`} {...props}>
      {children}
    </p>
  );
}

export function Small({ children, className = '', ...props }) {
  return (
    <p className={`small ${className}`} {...props}>
      {children}
    </p>
  );
}

// Usage example:
// <Heading level={1}>Main Title</Heading>
// <Text variant="body-large">Larger body text</Text>
// <Lead>Leading paragraph</Lead>
// <Small>Small print text</Small> 