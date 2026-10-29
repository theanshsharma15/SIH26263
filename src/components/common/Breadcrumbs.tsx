import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const location = useLocation();

  // If items not provided, parse path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const derivedItems: BreadcrumbItem[] = items || pathParts.map((part, index) => {
    const url = `/${pathParts.slice(0, index + 1).join('/')}`;
    const formatted = part
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      label: formatted,
      href: index < pathParts.length - 1 ? url : undefined,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500 py-2.5 px-4 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto w-full flex items-center flex-wrap gap-1.5">
        <Link to="/" className="inline-flex items-center gap-1 hover:text-gov-navy-600 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        {derivedItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {item.href ? (
              <Link to={item.href} className="hover:text-gov-navy-600 font-medium transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-800 font-semibold truncate max-w-xs">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};
