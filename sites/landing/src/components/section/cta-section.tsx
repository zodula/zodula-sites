import React from 'react';
import { ArrowRight, Github, Zap } from 'lucide-react';

export default function CtaSection() {
    return (
        <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-2xl font-bold text-primary mb-2">Ready to Build 10x Faster?</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Join thousands of developers who are already building amazing backends with Zodula. Get started in minutes, not hours.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
                    <a href="/docs" className="bg-primary hover:bg-primary/90 text-foreground px-6 py-1 rounded-md transition-colors flex items-center justify-center">
                        <Zap className="w-4 h-4 mr-2" />
                        See the Docs
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                    <a href="https://github.com/zodula" target="_blank" rel="noopener noreferrer" className="border-1 border-primary hover:bg-primary text-primary hover:text-primary-foreground px-6 py-1 rounded-md transition-colors flex items-center justify-center">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {[
                        { value: '10x', label: 'Faster Development' },
                        { value: '80%', label: 'Less Boilerplate' },
                        { value: '100%', label: 'Type Safe' }
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                            <div className="text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
