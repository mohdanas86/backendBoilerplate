/**
 * Header Component
 * 
 * Main navigation header with responsive mobile menu.
 * Features:
 * - Logo and branding
 * - Desktop navigation links
 * - Mobile hamburger menu with slide-out panel
 * - Active route highlighting
 * 
 * @component
 */

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Menu, X, Calendar } from 'lucide-react'

const navigation = [
    { name: 'Events', href: '/' },
    { name: 'Create Event', href: '/create' },
]

/**
 * Navigation header component with mobile responsiveness
 */
export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()

    const isActive = (path: string) => {
        return location.pathname === path
    }

    return (
        <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
            <nav aria-label="Global" className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="flex items-center justify-center w-9 h-9 bg-blue-600 rounded">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">
                                EventFinder
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${isActive(item.href)
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex md:items-center md:gap-3">
                        <button className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors">
                            Sign In
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="inline-flex items-center justify-center p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Menu aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="md:hidden">
                <div className="fixed inset-0 z-50 bg-black/20" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm border-l border-gray-200">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                            <div className="flex items-center justify-center w-9 h-9 bg-blue-600 rounded">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">
                                EventFinder
                            </span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            <span className="sr-only">Close menu</span>
                            <X aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-6">
                        <div className="space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-4 py-3 text-base font-medium transition-colors ${isActive(item.href)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 space-y-3 pt-6 border-t border-gray-200">
                            <button className="w-full text-left px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                                Sign In
                            </button>
                            <button className="w-full bg-blue-600 text-white px-4 py-3 text-base font-medium hover:bg-blue-700 transition-colors">
                                Get Started
                            </button>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
