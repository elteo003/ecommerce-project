import { useEffect, useState } from 'react';

interface Rules {
  length: boolean;
  uppercase: boolean;
  special: boolean;
}

export default function PasswordRules({ password }: { password: string }) {
    const [rules, setRules] = useState<Rules>({ length: false, uppercase: false, special: false });

    useEffect(() => {
        setRules({
            length: password.length >= 10,
            uppercase: /[A-Z]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        });
    }, [password]);

    return (
        <ul className="mt-2 text-sm">
            <li className={rules.length ? 'text-green-500' : 'text-red-500'}>
                {rules.length ? '✔️' : '❌'} Min 10 caratteri
            </li>
            <li className={rules.uppercase ? 'text-green-500' : 'text-red-500'}>
                {rules.uppercase ? '✔️' : '❌'} Almeno 1 maiuscola
            </li>
            <li className={rules.special ? 'text-green-500' : 'text-red-500'}>
                {rules.special ? '✔️' : '❌'} Almeno 1 carattere speciale
            </li>
        </ul>
    );
}
