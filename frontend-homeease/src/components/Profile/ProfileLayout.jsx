import React, { useState } from 'react';
import { Tabs } from 'antd';
import { UserOutlined, LockOutlined, BarChartOutlined } from '@ant-design/icons';
import BasicInfo from './BasicInfo';
import SecuritySettings from './SecuritySettings';
import ProfileStats from './ProfileStats';
import { useAuth } from '../../contexts/AuthContext';

const ProfileLayout = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');

  const getTabItems = () => {
    const commonTabs = [
      {
        key: 'basic',
        label: (
          <span>
            <UserOutlined />
            Thông tin cá nhân
          </span>
        ),
      },
      {
        key: 'security',
        label: (
          <span>
            <LockOutlined />
            Bảo mật
          </span>
        ),
      }
    ];

    // Nếu là resident mới hiển thị tab thống kê
    if (user?.role === 'resident') {
      commonTabs.push({
        key: 'stats',
        label: (
          <span>
            <BarChartOutlined />
            Thống kê hoạt động
          </span>
        ),
      });
    }

    return commonTabs;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfo />;
      case 'security':
        return <SecuritySettings />;
      case 'stats':
        return <ProfileStats />;
      default:
        return <BasicInfo />;
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 bg-white border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={getTabItems()}
            className="profile-tabs -mb-3 sm:-mb-4"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileLayout;