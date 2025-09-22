import { Suspense } from 'react';
import { Section } from '@/components/common/Section/Section';
import Navbar from '@/components/common/Navbar/Navbar';
import Home from '@/modules/Home/Home';
import LockComponent from '@/modules/Home/components/LockComponent';

export default function HomePage() {
  return (
    <Suspense>
      <LockComponent />
      <Section>
        <Navbar />
        <Home />
      </Section>
    </Suspense>
  );
}
