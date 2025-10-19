'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import RideBooking from '@/components/block/ride-booking';
import DriverDashboard from '@/components/block/driver-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NavigationIcon, CarIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <NavigationIcon className="h-6 w-6" />
            RideShare
          </h1>
          <div className="space-x-2">
            <Link href="/driver">
              <Button variant="outline" className="flex items-center gap-2">
                <CarIcon className="h-4 w-4" />
                Driver
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Get where you're going
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The smartest way to get around. Choose your ride, set your location, and go.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* User Card */}
          <Link href="/user">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Book a Ride</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Need a ride? Book instantly and get to your destination comfortably and safely.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                  Start Riding
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Driver Card */}
          <Link href="/driver">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-green-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CarIcon className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Drive & Earn</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Become a driver and start earning money on your own schedule.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
                  Start Driving
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚗</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Multiple Ride Options</h3>
            <p className="text-gray-600">Choose from Mini, Sedan, or SUV based on your needs and budget.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Live Tracking</h3>
            <p className="text-gray-600">Real-time tracking of your ride and driver location.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
            <p className="text-gray-600">Cashless payments with transparent pricing.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
