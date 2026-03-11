interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Retry
        </button>
      )}
    </div>
  );
}
