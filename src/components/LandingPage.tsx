import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bug,
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Target,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bug className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              BugTracker Pro
            </h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/bug-submission">
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              >
                Submit Bug
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button
                variant="ghost"
                className="text-purple-300 hover:text-white hover:bg-purple-900/30"
              >
                Admin Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Track Bugs Like a Pro
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Streamline your bug reporting and management process with our
              comprehensive tracking system. From submission to resolution,
              we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/bug-submission">
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-3 text-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-3 text-lg"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-purple-950/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage bugs efficiently and effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 border-purple-800/30 hover:border-purple-600/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Bug className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Easy Bug Reporting
                </h3>
                <p className="text-gray-400">
                  Submit detailed bug reports with our intuitive form. Automatic
                  ticket generation keeps everything organized.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-800/30 hover:border-purple-600/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-400">
                  Get insights into bug trends, resolution times, and team
                  performance with comprehensive analytics.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-800/30 hover:border-purple-600/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Team Collaboration
                </h3>
                <p className="text-gray-400">
                  Assign tickets to team members, track progress, and maintain
                  clear communication throughout the resolution process.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-800/30 hover:border-purple-600/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Secure & Reliable
                </h3>
                <p className="text-gray-400">
                  Enterprise-grade security ensures your data is protected while
                  maintaining 99.9% uptime reliability.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-800/30 hover:border-purple-600/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Real-time Updates
                </h3>
                <p className="text-gray-400">
                  Stay informed with instant notifications and real-time status
                  updates on all your bug reports.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-800/30 hover:border-purple-600/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Smart Prioritization
                </h3>
                <p className="text-gray-400">
                  Automatically prioritize bugs based on severity, impact, and
                  business requirements for optimal resource allocation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/20 to-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                10K+
              </div>
              <div className="text-gray-300 text-lg">Bugs Resolved</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                500+
              </div>
              <div className="text-gray-300 text-lg">Active Teams</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                99.9%
              </div>
              <div className="text-gray-300 text-lg">Uptime</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                24/7
              </div>
              <div className="text-gray-300 text-lg">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 border-purple-800/30">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "BugTracker Pro has revolutionized how we handle bug reports.
                  The analytics dashboard gives us incredible insights."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">JS</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">John Smith</div>
                    <div className="text-gray-400 text-sm">Lead Developer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-800/30">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "The team collaboration features are outstanding. We can track
                  every bug from submission to resolution seamlessly."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">MJ</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      Maria Johnson
                    </div>
                    <div className="text-gray-400 text-sm">Project Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-800/30">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Simple, powerful, and reliable. BugTracker Pro has become an
                  essential part of our development workflow."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">DW</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">David Wilson</div>
                    <div className="text-gray-400 text-sm">QA Engineer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/30 to-purple-800/30">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of teams who trust BugTracker Pro to manage their
              bug reporting and resolution process.
            </p>
            <Link to="/bug-submission">
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-12 py-4 text-xl">
                Start Tracking Bugs Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bug className="h-6 w-6 text-purple-400" />
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  BugTracker Pro
                </h3>
              </div>
              <p className="text-gray-400">
                The ultimate bug tracking and management solution for modern
                development teams.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/integrations"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/help"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/track-ticket"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Track Ticket
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-900/30 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} BugTracker Pro. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
