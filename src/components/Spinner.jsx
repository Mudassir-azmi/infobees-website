function Spinner({ className = "" }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`} role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-navy/20 border-t-gold" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;
