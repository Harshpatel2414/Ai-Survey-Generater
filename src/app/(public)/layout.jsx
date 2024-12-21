import Header from '@/components/Header';
import React from 'react';

const PublicUserLayout = ({ children }) => {
    return (
        <div className='h-dvh w-full bg-gray-100 relative'>
              <Header />
            <main>
                {children}
            </main>
        </div>
    );
};

export default PublicUserLayout;