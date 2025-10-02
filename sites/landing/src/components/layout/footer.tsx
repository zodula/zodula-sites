import React from 'react';
import { Github } from 'lucide-react';

const links = {
    links: [
        { href: 'https://solutions.zodula.dev', label: 'Solutions', target: '_blank' },
        { href: 'https://docs.zodula.dev', label: 'Documentation', target: '_blank' },
    ],
    community: [
        { href: 'https://github.com/zodula/zodula', label: 'GitHub', target: '_blank' },
    ],
    legal: [
        { href: 'https://zodula.dev/privacy', label: 'Privacy Policy', target: '_blank' },
        { href: 'https://zodula.dev/terms', label: 'Terms of Service', target: '_blank' }
    ]
} as const;

export default function Footer() {
    return (
        <footer className="bg-background text-foreground py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <img src="/public/assets/logo.png" alt="Zodula" className="w-10 h-10 rounded" />
                            <span className="ml-3 text-xl font-bold">Zodula</span>
                        </div>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            The fastest way to build full stack apps. Define your data models in TypeScript and get instant APIs, admin UIs, and authentication.
                        </p>
                        <div className="flex space-x-4">
                            {[Github].map((Icon, i) => (
                                <a key={i} href="https://github.com/zodula/zodula" target="_blank" className="text-muted-foreground hover:text-white transition-colors">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {[
                        { title: 'Links', items: links.links },
                        { title: 'Community', items: links.community }
                    ].map((section, i) => (
                        <div key={i}>
                            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.items.map((item, j) => (
                                    <li key={j}>
                                        <a href={item.href} target={item.target} className="text-muted-foreground hover:text-white transition-colors">
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm">© 2025 Zodula. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        {links.legal.map((item, i) => (
                            <a key={i} href={item.href} className="text-muted-foreground hover:text-white text-sm transition-colors">
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
