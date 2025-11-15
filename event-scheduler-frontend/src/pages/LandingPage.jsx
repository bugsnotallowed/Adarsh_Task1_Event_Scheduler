import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, Zap, CheckCircle, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Conflict Detection",
      description: "Automatically identifies overlapping events in your schedule"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Suggestions",
      description: "Get alternative timing recommendations for conflicting events"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      description: "Set your working hours (e.g., 8:00-18:00) for optimized scheduling"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Easy Resolution",
      description: "Resolve conflicts with one-click event rescheduling"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ScheduleMyTask
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => window.location.href = '/login'} className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                Login
              </button>
              <button onClick={() => window.location.href = '/register'} className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium">
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Smart Scheduling Made Simple
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Never Miss a Beat with{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Intelligent Scheduling
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Automatically detect conflicting events and get smart suggestions for alternative timings. 
                Stay organized within your working hours effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => window.location.href = '/register'} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-xl transform hover:-translate-y-1 transition-all font-semibold text-lg flex items-center justify-center space-x-2">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 rounded-lg border-2 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 transition-all font-semibold text-lg">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-red-400 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-teal-400 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 border-2 border-white"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trusted by 10,000+ professionals</p>
                </div>
              </div>
            </div>

            {/* Visual Demo */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Today's Schedule</h3>
                  <span className="text-sm text-gray-500">8:00 - 18:00</span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">Team Meeting</p>
                        <p className="text-sm text-gray-600">9:00 - 10:00</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-pulse">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">Client Call</p>
                        <p className="text-sm text-gray-600">10:00 - 11:00</p>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-pulse">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">Project Review</p>
                        <p className="text-sm text-gray-600">10:30 - 11:30</p>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                  </div>

                  <div className="bg-indigo-50 border-2 border-dashed border-indigo-300 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-indigo-700">
                      <Zap className="w-5 h-5" />
                      <p className="font-semibold">Suggested: Move to 11:30 - 12:30</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-semibold">2 Conflicts Found</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Seamless Scheduling
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your time effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-6 rounded-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all cursor-pointer border border-transparent hover:border-indigo-200">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Schedule?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of professionals who never miss an important event
          </p>
          <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all font-bold text-lg">
            Start Free Trial
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ScheduleMyTask</span>
          </div>
          <p>&copy; 2025 ScheduleMyTask. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}