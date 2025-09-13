import { Suspense } from 'react';
import { Section } from '@/components/common/Section/Section';
import Navbar from '@/components/common/Navbar/Navbar';
import Home from '@/modules/Home/Home';

export default function HomePage() {
  return (
    <Suspense>
      <Section>
        <Navbar />
        <Home />
      </Section>
    </Suspense>
  );
}
