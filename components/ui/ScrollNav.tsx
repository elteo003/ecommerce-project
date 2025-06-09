// components/ui/ScrollNav.tsx
import React, { useEffect, useState } from 'react';

interface ScrollNavProps {
    sectionIds: string[];
}

export default function ScrollNav({ sectionIds }: ScrollNavProps) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const idx = sectionIds.indexOf(entry.target.id);
                        if (idx !== -1) setActive(idx);
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5, // se metà sezione è visibile la consideriamo attiva
            }
        );

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sectionIds]);

    const handleClick = (idx: number) => {
        document
            .getElementById(sectionIds[idx])
            ?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav
            style={{
                position: 'fixed',
                top: '50%',
                right: '1rem',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                zIndex: 900,
            }}
        >
            {sectionIds.map((_, i) => (
                <button
                    key={i}
                    onClick={() => handleClick(i)}
                    style={{
                        width: active === i ? '1rem' : '0.75rem',
                        height: active === i ? '1rem' : '0.75rem',
                        borderRadius: '50%',
                        background: active === i ? '#fff' : 'rgba(255,255,255,0.5)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                    }}
                    aria-label={`Vai a sezione ${i + 1}`}
                />
            ))}
        </nav>
    );
}
