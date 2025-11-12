

import React from 'react';
import { ModuleType } from '../types';
import { MODULES } from '../constants';

interface SidebarProps {
    activeModule: ModuleType | 'Translation' | null;
    onSelectModule: (module: ModuleType | 'Translation' | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onSelectModule }) => {
    
    const NavItem: React.FC<{
        isActive: boolean;
        onClick: () => void;
        icon: string;
        icon_solid: string;
        label: string;
    }> = ({ isActive, onClick, icon, icon_solid, label }) => {
        return (
            <button 
                onClick={onClick}
                className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-colors duration-200 ${
                    isActive 
                        ? 'bg-sky-100 text-sky-700 font-semibold' 
                        : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-800'
                }`}
            >
                <div className="w-5 h-5 mr-4" dangerouslySetInnerHTML={{ __html: isActive ? icon_solid : icon }} />
                <span>{label}</span>
            </button>
        );
    }
    
    return (
        <div className="w-64 bg-white/80 backdrop-blur-lg border-r border-slate-200 flex-shrink-0 flex flex-col p-4 space-y-2">
            <div className="flex items-center space-x-3 p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-sky-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.1 8.25 15 9.75M9 8.25v-2.5m-3.334 2.364c1.12 0 2.233.038 3.334.114M6.666 8.25v-2.5m6.668 0h1.666" />
                </svg>
                <h1 className="text-xl font-bold text-slate-900">LingoLeap AI</h1>
            </div>
            
            <NavItem
                isActive={activeModule === null}
                onClick={() => onSelectModule(null)}
                icon={`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>`}
                icon_solid={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M11.25 3.75A2.25 2.25 0 0113.5 6v2.25a2.25 2.25 0 01-2.25 2.25H9A2.25 2.25 0 016.75 8.25V6A2.25 2.25 0 019 3.75h2.25zM11.25 13.5A2.25 2.25 0 0113.5 15.75v2.25a2.25 2.25 0 01-2.25 2.25H9a2.25 2.25 0 01-2.25-2.25V15.75A2.25 2.25 0 019 13.5h2.25z" /><path fill-rule="evenodd" d="M3 6a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 8.25V6zm10.5 0A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25V6zM3 15.75A2.25 2.25 0 015.25 13.5h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-2.25zM13.5 15.75a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" clip-rule="evenodd" /></svg>`}
                label="Dashboard"
            />
            
            <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
                {MODULES.map(module => (
                    <NavItem
                        key={module.id}
                        isActive={activeModule === module.id}
                        onClick={() => onSelectModule(module.id)}
                        icon={module.icon}
                        icon_solid={module.icon_solid}
                        label={module.title}
                    />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;