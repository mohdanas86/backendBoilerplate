'use client'

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Events', href: '/' },
    { name: 'Create Event', href: '/create' },
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()

    const isActive = (path: string) => {
        return location.pathname === path
    }

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
            <nav aria-label="Global" className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg group-hover:scale-105 transition-transform duration-200">
                                <CalendarDaysIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                EventFinder
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive(item.href)
                                        ? 'text-blue-600'
                                        : 'text-gray-700 hover:text-blue-600'
                                    }`}
                            >
                                {item.name}
                                {isActive(item.href) && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                            Sign In
                        </button>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="md:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 shadow-xl">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                                <CalendarDaysIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                EventFinder
                            </span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-lg p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-8 flow-root">
                        <div className="-my-6 divide-y divide-gray-200">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`-mx-3 block rounded-lg px-3 py-3 text-base font-medium transition-colors duration-200 ${isActive(item.href)
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="py-6 space-y-3">
                                <button className="w-full text-left px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                    Sign In
                                </button>
                                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-3 rounded-lg text-base font-medium hover:shadow-lg transition-all duration-200">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
