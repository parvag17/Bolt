import React, { useState } from 'react';
import { Settings, Globe, User, Bell, Shield, Palette } from 'lucide-react';
import CurrencySettings from './CurrencySettings';
import { useAuth } from '../../context/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('currency');

  const tabs = [
    { id: 'currency', label: 'Currency', icon: Globe },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'currency':
        return <CurrencySettings />;
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Settings</h3>
              <p className="text-gray-600">Manage your account information</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600">Profile settings coming soon!</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification Settings</h3>
              <p className="text-gray-600">Configure your notification preferences</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600">Notification settings coming soon!</p>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Settings</h3>
              <p className="text-gray-600">Manage your account security</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600">Security settings coming soon!</p>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Appearance Settings</h3>
              <p className="text-gray-600">Customize the look and feel</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600">Appearance settings coming soon!</p>
            </div>
          </div>
        );
      default:
        return <CurrencySettings />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;