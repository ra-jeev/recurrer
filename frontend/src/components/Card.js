import './Card.css';

export const Card = ({ children, title, className }) => {
  return (
    <div className={`card${className ? ` ${className}` : ''}`}>
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};
