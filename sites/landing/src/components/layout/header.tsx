import React, { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/60 backdrop-blur-sm`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.location.href = '/'}>
                            <img src="/public/assets/logo.png" alt="Zodula" className="w-10 h-10 rounded" />
                            <span className="ml-3 text-xl font-bold">Zodula</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <a href="#docs" target="_blank" className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors duration-200">
                            Documentation
                        </a>
                        <a href="#solutions" target="_blank" className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors duration-200">
                            Solutions
                        </a>
                        <a href="https://github.com/zodula/zodula" target="_blank" className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors duration-200">
                            GitHub
                        </a>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-muted-foreground hover:text-foreground p-2 transition-colors duration-200"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t transition-all duration-300 bg-background/95 backdrop-blur-sm border-border/50`}>
                            <a
                                href="#docs"
                                className="text-muted-foreground hover:text-foreground block px-3 py-2 text-base font-medium transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Documentation
                            </a>
                            <a
                                href="#solutions"
                                className="text-muted-foreground hover:text-foreground block px-3 py-2 text-base font-medium transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Solutions
                            </a>
                            {/* GitHub */}
                            <a href="https://github.com/zodula/zodula" className="text-muted-foreground hover:text-foreground block px-3 py-2 text-base font-medium transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                GitHub
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
