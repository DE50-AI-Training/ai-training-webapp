"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/models", label: "Models" },
        { href: "/datasets", label: "Datasets" },
        { href: "/training", label: "Training" },
    ];

    return (
        /* Placée en sticky tout en haut de la page */
        <nav className="sticky top-0 z-50 flex justify-center ">
            <div className=" rounded-b-2xl bg-white ring-2 ring-gray-200 px-10 w-full">
                <ul className="flex gap-12 py-4">
                    {links.map(({ href, label }) => {
                        // 1) le lien "/" n'est actif que sur la Home
                        // 2) pour les autres, on accepte "/foo" ou "/foo/bar"
                        const active =
                            href === "/"
                                ? pathname === "/"
                                : pathname === href ||
                                  pathname.startsWith(`${href}/`);

                        return (
                            <li key={href} className="relative">
                                <Link
                                    href={href}
                                    className={clsx(
                                        "block font-medium transition-colors duration-150",
                                        active
                                            ? "text-black"
                                            : "text-gray-500 hover:text-black",
                                    )}
                                >
                                    {label}
                                </Link>

                                {active && (
                                    /* Barre fine 100 % largeur sous l’onglet actif. Pas de changement de graisse → aucun décalage. */
                                    <span className="absolute left-0 -bottom-1 h-0.5 w-full rounded bg-black" />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};
export default Navbar;
