'use client';
import LockUp from '@/components/LockUp';
import { SplitText } from '@/components/split-text';
import { BeamsBackground } from '@/components/ui/beams-background';
import React, { useState } from 'react';

const LockComponent = () => {
  const [check, setCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      {!check && (
        <>
          <BeamsBackground>
            <div className="fixed inset-0 bg-black/50 z-50">
              <div className="min-h-screen flex flex-col justify-center items-center">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mb-4"></div>
                  </div>
                ) : (
                  <>
                    <SplitText
                      text="Welcome to EliteCron"
                      className="text-2xl md:text-3xl text-white lg:text-4xl font-bold text-center max-w-2xl mb-3"
                      delay={50}
                      animationFrom={{ opacity: 0, transform: 'translate3d(0, 30px, 0)' }}
                      animationTo={{ opacity: 1, transform: 'translate3d(0, 0, 0)' }}
                      easing="easeOutCubic"
                      threshold={0.3}
                      rootMargin="-100px"
                    />
                    <SplitText
                      text="Enter the Password to Access this Tool built by AshutoshDM1"
                      className="text-sm lg:text-base text-white font-normal text-center max-w-2xl"
                      delay={50}
                      animationFrom={{ opacity: 0, transform: 'translate3d(0, 30px, 0)' }}
                      animationTo={{ opacity: 1, transform: 'translate3d(0, 0, 0)' }}
                      easing="easeOutCubic"
                      threshold={0.3}
                      rootMargin="-100px"
                    />
                    <h1 className="text-white text-4xl font-bold mb-4"></h1>
                    <p className="mb-10 text-center"></p>
                    <LockUp check={check} setCheck={setCheck} setLoading={setLoading} />
                  </>
                )}
              </div>
            </div>
          </BeamsBackground>
        </>
      )}
    </>
  );
};

export default LockComponent;
