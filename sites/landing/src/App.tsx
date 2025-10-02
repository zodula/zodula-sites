import React from 'react';
import Header from './components/layout/header';
import HeroSection from './components/section/hero-section';
import CodeExamplesSection from './components/section/code-examples-section';
import CtaSection from './components/section/cta-section';
import Footer from './components/layout/footer';

export default function App() {
    return (
        <div className="min-h-screen bg-background max-md:px-4 max-md:pt-10">
            <Header />
            <HeroSection />
            <CodeExamplesSection />
            <CtaSection />
            <Footer />
        </div>
    );
}