import React from 'react';
import { Tabs } from 'antd';
import { UserOutlined, LockOutlined, BarChartOutlined } from '@ant-design/icons';
import BasicInfo from './BasicInfo';
import SecuritySettings from './SecuritySettings';
import ProfileStats from './ProfileStats';
import { useAuth } from '../../contexts/AuthContext';

const ProfileLayout = () => {
  const { user } = useAuth();

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
        children: <BasicInfo />
      },
      {
        key: 'security',
        label: (
          <span>
            <LockOutlined />
            Bảo mật
          </span>
        ),
        children: <SecuritySettings />
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
        children: <ProfileStats />
      });
    }

    return commonTabs;
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50">
      <div className="h-full">
        <div className="flex items-center px-6 py-3 bg-white border-b">
          <h1 className="text-xl font-bold text-gray-800 mr-8">
            {user?.role === 'admin' ? 'Thông tin Admin' : 'Hồ sơ của tôi'}
          </h1>
          <Tabs
            defaultActiveKey="basic"
            items={getTabItems()}
            tabBarStyle={{
              margin: 0,
              borderBottom: 'none',
            }}
            className="flex-1 ant-tabs-no-bottom-border"
          />
        </div>

        <div className="h-[calc(100%-53px)]">
          <div className="h-full">
            <Tabs
              defaultActiveKey="basic"
              items={getTabItems()}
              onChange={key => window.location.hash = `#${key}`}
              activeKey={window.location.hash.slice(1) || 'basic'}
              tabBarStyle={{ display: 'none' }}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;