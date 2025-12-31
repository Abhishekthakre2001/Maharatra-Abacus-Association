import { useState } from 'react';

const Tabs = ({
  // Required props
  tabs = [],
  activeTab = 0,
  onTabChange,
  
  // Styling
  variant = 'default', // default, pills, underline, cards
  align = 'left', // left, center, right
  fullWidth = false,
  
  // Behavior
  className = '',
  tabClassName = '',
  contentClassName = '',
  
  // Icons
  showIcons = true,
  
  // Badges
  showBadges = true,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(activeTab);

  // Use controlled component if onTabChange is provided, otherwise internal state
  const currentActiveTab = onTabChange ? activeTab : internalActiveTab;

  const handleTabClick = (index) => {
    if (onTabChange) {
      onTabChange(index);
    } else {
      setInternalActiveTab(index);
    }
  };

  // Variant styles
  const variantStyles = {
    default: {
      container: 'border-b border-slate-200',
      tab: {
        base: 'px-4 py-3 border-b-2 font-medium text-sm transition-all duration-200',
        inactive: 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300',
        active: 'border-blue-600 text-blue-600',
      },
    },
    pills: {
      container: 'space-x-2',
      tab: {
        base: 'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
        inactive: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
        active: 'bg-blue-600 text-white shadow-lg',
      },
    },
    underline: {
      container: 'border-b border-slate-200',
      tab: {
        base: 'px-4 py-3 font-medium text-sm transition-all duration-200 relative',
        inactive: 'text-slate-600 hover:text-slate-800',
        active: 'text-blue-600',
      },
    },
    cards: {
      container: 'space-x-4',
      tab: {
        base: 'px-6 py-4 rounded-xl border-2 font-medium transition-all duration-200',
        inactive: 'border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md',
        active: 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg',
      },
    },
  };

  // Alignment styles
  const alignmentStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const currentVariant = variantStyles[variant];
  const currentAlignment = alignmentStyles[align];

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Headers */}
      <div
        className={`
          flex flex-wrap gap-2 mb-6
          ${currentVariant.container}
          ${fullWidth ? 'w-full' : ''}
          ${currentAlignment}
        `}
      >
        {tabs.map((tab, index) => {
          const isActive = index === currentActiveTab;
          const Icon = tab.icon;
          const badge = tab.badge;

          return (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`
                flex items-center gap-2 whitespace-nowrap
                ${currentVariant.tab.base}
                ${isActive ? currentVariant.tab.active : currentVariant.tab.inactive}
                ${fullWidth ? 'flex-1 justify-center' : ''}
                ${tabClassName}
              `}
            >
              {/* Icon */}
              {showIcons && Icon && (
                <Icon
                  size={18}
                  className={isActive ? 'text-current' : 'text-slate-500'}
                />
              )}

              {/* Label */}
              <span>{tab.label}</span>

              {/* Badge */}
              {showBadges && badge !== undefined && badge !== null && (
                <span
                  className={`
                    px-2 py-1 text-xs rounded-full font-medium
                    ${
                      isActive
                        ? 'bg-white bg-opacity-20 text-current'
                        : 'bg-slate-200 text-slate-700'
                    }
                  `}
                >
                  {badge}
                </span>
              )}

              {/* Underline variant specific */}
              {variant === 'underline' && isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className={contentClassName}>
        {tabs[currentActiveTab]?.content || (
          <div className="text-center py-8 text-slate-500">
            No content available for this tab
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;