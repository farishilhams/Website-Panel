import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// Smooth counting animation hook
function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const numTarget = parseInt(String(target).replace(/\D/g, ""), 10);
    if (isNaN(numTarget) || numTarget === 0) {
      setCount(0);
      return;
    }

    startRef.current = null;
    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numTarget));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(numTarget);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return count;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = "vs bulan lalu",
  gradient = "from-blue-600 to-indigo-600",
  bgLight = "bg-blue-50/60",
  textColor = "text-blue-600",
  onClick,
  to,
  change,
  index = 0,
  animate = true,
}) {
  // Detect if value is purely numeric for counting
  const rawNum = parseInt(String(value).replace(/\D/g, ""), 10);
  const isNumeric = !isNaN(rawNum) && typeof value !== "string" || (typeof value === "number");
  const countedValue = useCountUp(isNumeric ? rawNum : 0, 900 + index * 80);

  // Determine display value — animate only pure numbers
  const displayValue = isNumeric && animate
    ? countedValue.toLocaleString("id-ID")
    : value !== undefined
    ? value
    : "0";

  const delayClass = [
    "delay-0", "delay-100", "delay-200", "delay-300", "delay-400", "delay-500",
  ][Math.min(index, 5)];

  const cardContent = (
    <div
      onClick={onClick}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`group relative bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-1.5 animate-fade-in ${
        to || onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2 font-sans tracking-tight tabular-nums">
            {displayValue}
          </h3>
        </div>

        {/* Icon with gradient badge */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} text-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
        >
          {Icon && <Icon size={22} strokeWidth={2.2} />}
        </div>
      </div>

      {/* Change / subtitle indicator if provided */}
      {change && (
        <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-semibold text-slate-500">{change}</span>
          {to && (
            <span className="text-[11px] font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              <span>Buka</span>
              <ArrowRight size={11} />
            </span>
          )}
        </div>
      )}

      {/* Trend indicator if provided */}
      {trend !== undefined && (
        <div className="mt-3.5 flex items-center gap-1.5 pt-2.5 border-t border-slate-100">
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${
              trend >= 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {trend >= 0 ? (
              <ArrowUpRight size={12} strokeWidth={2.5} />
            ) : (
              <ArrowDownRight size={12} strokeWidth={2.5} />
            )}
            {Math.abs(trend)}%
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return <Link to={to} className="block no-underline focus:outline-none">{cardContent}</Link>;
  }

  return cardContent;
}
