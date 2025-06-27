import React from 'react';
import { BookOpen, Shield, Users, Award, CheckCircle, BarChart3, ArrowRight } from 'lucide-react';
import { View } from '../types';

interface LandingPageProps {
  onNavigate: (view: View) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
          src="/lasak tech logo.png"  // ✅ Change this to your actual logo path
          alt="LASAK Logo"
          className="h-10 w-10 object-contain rounded-md"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lasak Technologies pvt</h1>
          <p className="text-sm text-gray-600">Advanced Assessment Platform</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">Visit us at</p>
        <a
          href="https://lasak.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          lasak.in
        </a>
      </div>
    </div>
  </div>
</header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block mt-2">
              LASAK Technology
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the future of digital assessments with our cutting-edge examination platform. 
            Secure, efficient, and designed for excellence.
          </p>
          
          {/* Portal Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={() => onNavigate('student')}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-3 min-w-[200px]"
            >
              <BookOpen className="h-6 w-6" />
              <span>Candidate Portal</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => onNavigate('examiner')}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-3 min-w-[200px]"
            >
              <Shield className="h-6 w-6" />
              <span>Interviewer Portal</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LASAK Technology?</h3>
            <p className="text-lg text-gray-600">Discover the features that make us the preferred choice for digital assessments</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">User-Friendly Interface</h4>
              <p className="text-gray-600">Intuitive design that makes testing simple and stress-free for both students and examiners.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h4>
              <p className="text-gray-600">Advanced security measures ensure the integrity and confidentiality of all assessments.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Analytics</h4>
              <p className="text-gray-600">Get detailed insights and performance analysis powered by advanced AI technology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About LASAK Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">About LASAK Technology</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4"></h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                About Lasak Technologies
At Lasak Technologies, we are dedicated to delivering transformative digital solutions that empower businesses to thrive in the digital era. Headquartered in Coimbatore, Tamil Nadu, we specialize in full-spectrum digital marketing services tailored to meet the unique needs of modern enterprises. From startups to large-scale enterprises, our mission is to enable sustainable growth through innovation, strategy, and cutting-edge technology.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Advanced AI-powered evaluation system</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Real-time performance analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Secure and scalable infrastructure</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700"></span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="text-center">
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h5 className="text-xl font-semibold text-gray-900 mb-2">Industry Recognition</h5>
                <p className="text-gray-600 mb-4">
                  Trusted by leading educational institutions and recognized for innovation in digital assessment technology.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">50+</div>
                    <div className="text-sm text-gray-600">Institutions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">100+</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">LASAK Technology</span>
              </div>
              <p className="text-gray-400">
                Transforming education through innovative digital assessment solutions.
              </p>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Contact Information</h6>
              <div className="space-y-2 text-gray-400">
                <p>Email: info@lasak.in</p>
                <p>Website: <a href="https://lasak.in" className="text-blue-400 hover:text-blue-300">lasak.in</a></p>
                <p></p>
              </div>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Platform Features</h6>
              <div className="space-y-2 text-gray-400">
                <p>• Secure Online Testing</p>
                <p>• AI-Powered Analytics</p>
                <p>• Real-time Results</p>
                <p>• Multi-device Support</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 LASAK Technology. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};