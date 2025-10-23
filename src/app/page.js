'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import RideBooking from '@/components/block/ride-booking';
import DriverDashboard from '@/components/block/driver-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NavigationIcon, CarIcon, UserIcon, Car, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { CompanyName } from '@/constants/CompanyName';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <NavigationIcon className="h-6 w-6" />
            {CompanyName}
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
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Get where you're going
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The smartest way to get around. Choose your ride, set your location, and go.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* User Card */}
          <Link href="/user">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-foreground rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Book a Ride</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Need a ride? Book instantly and get to your destination comfortably and safely.
                </p>
                <Button className="w-full">
                  Start Riding
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Driver Card */}
          <Link href="/driver">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-foreground rounded-full flex items-center justify-center mb-4">
                  <CarIcon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Drive & Earn</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Become a driver and start earning money on your own schedule.
                </p>
                <Button className="w-full">
                  Start Driving
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 border border-primary rounded-3xl">
            <div className="w-12 h-12 bg-foreground/80 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className='w-6 h-6 text-primary' />
            </div>
            <h3 className="font-semibold text-lg mb-2">Multiple Ride Options</h3>
            <p className="text-sm text-muted-foreground">Choose from Mini, Sedan, or SUV based on your needs and budget.</p>
          </div>

          <div className="text-center p-6 border border-primary rounded-3xl">
            <div className="w-12 h-12 bg-foreground/80 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className='w-6 h-6 text-primary' />
            </div>
            <h3 className="font-semibold text-lg mb-2">Live Tracking</h3>
            <p className="text-sm text-muted-foreground">Real-time tracking of your ride and driver location.</p>
          </div>

          <div className="text-center p-6 border border-primary rounded-3xl">
            <div className="w-12 h-12 bg-foreground/80 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className='w-6 h-6 text-primary' />
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">Cashless payments with transparent pricing.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
