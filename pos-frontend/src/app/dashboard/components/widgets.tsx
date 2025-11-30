export function StatWidget({ label, value, change, negative = false }) {
  return (
    <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
      <p className="text-white/60">{label}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
      <p className={negative ? "text-red-400" : "text-green-400"}>{change}</p>
    </div>
  );
}

export function MiniCard({ children, className = "" }) {
  return (
    <div className={`p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}
