import React, { useState, useEffect } from "react";
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
  Moon,
  Sun,
  Menu,
  X,
  Play,
  TrendingUp,
  Clock,
  FileText,
  Headphones,
  Settings,
  Globe,
  Smartphone,
  CreditCard,
  Layers,
  Database,
  Lock,
} from "lucide-react";

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bug className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold">BugTracker</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Features</a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Pricing</a>
            <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">About</a>
            <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Contact</a>
            <a href="#blog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Blog</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/admin/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/bug-submission">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Features</a>
              <a href="#pricing" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Pricing</a>
              <a href="#about" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">About</a>
              <a href="#contact" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Contact</a>
              <a href="#blog" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Blog</a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Link to="/admin/login">
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </Link>
                <Link to="/bug-submission">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Simplifying Bug Tracking for{" "}
                  <span className="text-blue-600 dark:text-blue-400">Growing Business</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Streamline your bug reporting and management process with our comprehensive tracking system. From submission to resolution, we've got you covered.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/bug-submission">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                    Get Started
                  </Button>
                </Link>
                <Button variant="outline" className="px-8 py-3 text-lg flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Hero Dashboard Mockup */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Dashboard</div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,247</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">892</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Resolved</div>
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-32">
                    <div className="flex items-end justify-between h-full">
                      {[40, 65, 45, 80, 55, 70, 85].map((height, index) => (
                        <div
                          key={index}
                          className="bg-blue-500 dark:bg-blue-400 rounded-t"
                          style={{ height: `${height}%`, width: '12%' }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Recent Activity</div>
                    {[
                      { name: "John D.", action: "submitted bug report", time: "2m ago" },
                      { name: "Sarah M.", action: "resolved ticket #1234", time: "5m ago" },
                      { name: "Mike R.", action: "assigned ticket", time: "8m ago" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">{activity.name}</span> {activity.action}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Run &{" "}
              <span className="text-blue-600 dark:text-blue-400">Grow Your Business</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive bug tracking system provides all the tools you need to manage issues efficiently and scale your operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Checkout Feature */}
            <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Checkout</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Streamlined bug submission process with automatic ticket generation and priority assignment.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Processing Time</span>
                    <span className="text-sm font-medium">{'< 2 seconds'}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>

            {/* Recurring Billing Feature */}
            <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Recurring Billing</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Automated ticket lifecycle management with recurring status updates and progress tracking.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Monthly Reports</span>
                    <span className="font-medium">$24</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Analytics Dashboard</span>
                    <span className="font-medium">$39</span>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Invoicing Feature */}
            <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Invoicing</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Generate detailed reports and invoices for resolved tickets with comprehensive billing integration.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">$1,200.00</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">This Month</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View Reports</Button>
              </CardContent>
            </Card>

            {/* Payment Link Feature */}
            <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Payment Link</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Quick ticket resolution with instant payment processing and automated status updates.
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-1">Fast Resolution</div>
                    <div className="text-sm opacity-90">Average 24 hours</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Create Link</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Make Bug Tracking Easier with{" "}
              <span className="text-blue-600 dark:text-blue-400">50+ Integrations</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Connect with your favorite tools and streamline your workflow
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: "Slack", icon: <Headphones className="h-8 w-8" />, color: "text-green-600" },
              { name: "GitHub", icon: <Database className="h-8 w-8" />, color: "text-gray-800 dark:text-gray-200" },
              { name: "Jira", icon: <Settings className="h-8 w-8" />, color: "text-blue-600" },
              { name: "Trello", icon: <Layers className="h-8 w-8" />, color: "text-blue-500" },
              { name: "Discord", icon: <Users className="h-8 w-8" />, color: "text-indigo-600" },
              { name: "Zapier", icon: <Zap className="h-8 w-8" />, color: "text-orange-500" },
            ].map((integration, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-600 group-hover:shadow-md transition-all duration-300">
                  <div className={`${integration.color} mb-3 flex justify-center`}>
                    {integration.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{integration.name}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Seamlessly integrate with popular development tools, communication platforms, and project management systems.
            </p>
            <Button variant="outline" className="px-8 py-3">
              View All Integrations
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="about" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              See What Our{" "}
              <span className="text-blue-600 dark:text-blue-400">Customers Are Saying</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of teams who trust our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                rating: 5,
                text: "BugTracker has revolutionized how we handle bug reports. The analytics dashboard gives us incredible insights into our development process.",
                author: "Sarah Johnson",
                role: "Lead Developer",
                company: "TechCorp",
                avatar: "SJ"
              },
              {
                rating: 5,
                text: "The team collaboration features are outstanding. We can track every bug from submission to resolution seamlessly.",
                author: "Mike Chen",
                role: "Project Manager", 
                company: "StartupXYZ",
                avatar: "MC"
              },
              {
                rating: 5,
                text: "Simple, powerful, and reliable. BugTracker has become an essential part of our development workflow.",
                author: "Emily Davis",
                role: "QA Engineer",
                company: "DevStudio",
                avatar: "ED"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                      <div className="text-sm text-gray-400 dark:text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="px-8 py-3">
              Read All Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Learn From The Blogs</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Stay updated with the latest insights and best practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "A Beginner Guide to Bug Tracking Best Practices",
                excerpt: "Learn the fundamentals of effective bug tracking and how to implement best practices in your team.",
                image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400",
                date: "Jan 15, 2024",
                readTime: "5 min read"
              },
              {
                title: "The modern developer's guide to bug management",
                excerpt: "Discover modern approaches to bug management that can transform your development workflow.",
                image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
                date: "Jan 12, 2024",
                readTime: "7 min read"
              },
              {
                title: "How Agile teams streamline bug resolution",
                excerpt: "Explore how agile methodologies can improve your bug resolution process and team collaboration.",
                image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
                date: "Jan 10, 2024",
                readTime: "6 min read"
              },
              {
                title: "Building better communication with stakeholders",
                excerpt: "Learn effective strategies for communicating bug status and resolution progress to stakeholders.",
                image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
                date: "Jan 8, 2024",
                readTime: "4 min read"
              }
            ].map((post, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{post.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Simplifying Bug Tracking for Growing Business
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of teams who trust BugTracker to manage their development process
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/bug-submission">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  Get Started
                </Button>
              </Link>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white px-8 py-3 text-lg">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Bug className="h-8 w-8 text-blue-400" />
                <h3 className="text-xl font-bold">BugTracker</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The ultimate bug tracking and management solution for modern development teams. Streamline your workflow and improve productivity.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#integrations" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#api" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#press" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#partners" className="hover:text-white transition-colors">Partners</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><Link to="/track-ticket" className="hover:text-white transition-colors">Track Ticket</Link></li>
                <li><a href="#status" className="hover:text-white transition-colors">System Status</a></li>
                <li><a href="#community" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} BugTracker. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <a href="#terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
                <a href="#cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;