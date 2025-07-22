import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, TrendingUp, Camera, Cpu, Anchor } from 'lucide-react';

interface LandingPageProps {
  onNavigateToProjectRoom: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToProjectRoom }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 lg:px-12">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#D97A45] rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#243D66]">
              Kick<span className="text-[#D97A45]">Impact</span>
            </span>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-[#243D66] hover:text-[#D97A45] transition-colors font-medium">
              Blogs
            </a>
            <button 
              onClick={onNavigateToProjectRoom}
              className="text-[#243D66] hover:text-[#D97A45] transition-colors font-medium"
            >
              Impact Project Library
            </button>
            <a href="#" className="text-[#243D66] hover:text-[#D97A45] transition-colors font-medium">
              Contact
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <div className="w-6 h-0.5 bg-[#243D66] mb-1"></div>
            <div className="w-6 h-0.5 bg-[#243D66] mb-1"></div>
            <div className="w-6 h-0.5 bg-[#243D66]"></div>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl lg:text-7xl font-bold text-[#243D66] mb-8 leading-tight">
            Shaping the<br />
            <span className="italic text-[#516f98]">Regenerative Economy</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-[#D97A45] max-w-4xl mx-auto mb-12 leading-relaxed">
            KickImpact offers curated exposure to institutional-grade impact ventures by acting as an 
            operating partner and catalyst for early-stage regenerative economy projects.
          </p>

          {/* KickImpact Logo with Scroll Animation */}
          <div className="flex justify-center items-center mb-16">
            <div 
              className="transform transition-transform duration-300 ease-out"
              style={{ 
                transform: `translateY(${scrollY * 0.1}px)`,
                opacity: Math.max(0.8, 1 - scrollY * 0.001)
              }}
            >
              <img 
                src="/kickimpact-logo.png" 
                alt="KickImpact Logo" 
                className="h-32 w-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <Button 
            onClick={onNavigateToProjectRoom}
            className="bg-[#D97A45] hover:bg-[#c16a3a] text-white px-8 py-3 text-lg font-medium rounded-full"
          >
            Explore Impact Projects
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-16 lg:px-12 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-[#D97A45] rounded-3xl p-8 lg:p-12 text-white">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#243D66] mb-6 leading-tight">
                We are a Swiss impact holding scaling real-economy ventures in{' '}
                <span className="text-[#516f98]">green infrastructure, circular economy, and nature-based finance</span>
                {' '}— through capital, governance, and execution. Built by operators, for regeneration.
              </h2>
            </div>
            
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-[#D97A45] rounded-full flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <Leaf className="w-12 h-12 text-[#243D66]" />
                </div>
                <div className="absolute w-40 h-40 border-4 border-[#D97A45] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Stack Section */}
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold text-center mb-16">
            <span className="text-[#243D66]">KickImpact's Value Stack for</span>{' '}
            <span className="text-[#D97A45]">Real-Economy Impact</span>
          </h2>

          <div className="flex justify-center items-center">
            <div className="relative max-w-4xl">
              {/* Pyramid Structure */}
              <div className="flex flex-col items-center space-y-6">
                
                {/* Level 1 - Top of Pyramid (Smallest) */}
                <div className="relative">
                  <div 
                    className="bg-white border-4 border-[#D97A45] shadow-lg transform hover:scale-105 transition-all duration-300"
                    style={{
                      width: '280px',
                      height: '120px',
                      clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div className="text-center px-4 py-2">
                      <h3 className="text-lg font-bold text-[#243D66] leading-tight">Capital</h3>
                      <h3 className="text-lg font-bold text-[#243D66] leading-tight">Structuring</h3>
                      <p className="text-sm font-medium text-[#243D66]">& GP Innovation</p>
                    </div>
                  </div>
                  {/* Icon */}
                  <div className="absolute -right-20 top-1/2 transform -translate-y-1/2">
                    <div className="w-12 h-12 bg-[#516f98] rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Level 2 */}
                <div className="relative">
                  <div 
                    className="bg-white border-4 border-[#D97A45] shadow-lg transform hover:scale-105 transition-all duration-300"
                    style={{
                      width: '360px',
                      height: '120px',
                      clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div className="text-center px-4 py-2">
                      <h3 className="text-lg font-bold text-[#243D66] leading-tight">Tech Infrastructure</h3>
                      <p className="text-sm font-medium text-[#243D66]">& Transparency</p>
                    </div>
                  </div>
                  {/* Icon */}
                  <div className="absolute -right-24 top-1/2 transform -translate-y-1/2">
                    <div className="w-12 h-12 bg-[#516f98] rounded-full flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Level 3 */}
                <div className="relative">
                  <div 
                    className="bg-white border-4 border-[#D97A45] shadow-lg transform hover:scale-105 transition-all duration-300"
                    style={{
                      width: '440px',
                      height: '120px',
                      clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div className="text-center px-4 py-2">
                      <h3 className="text-lg font-bold text-[#243D66] leading-tight">Industrial Operating</h3>
                      <p className="text-sm font-medium text-[#243D66]">Models</p>
                    </div>
                  </div>
                  {/* Icon */}
                  <div className="absolute -right-28 top-1/2 transform -translate-y-1/2">
                    <div className="w-12 h-12 bg-[#D97A45] rounded-full flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Level 4 - Base of Pyramid (Largest) */}
                <div className="relative">
                  <div 
                    className="bg-white border-4 border-[#D97A45] shadow-lg transform hover:scale-105 transition-all duration-300"
                    style={{
                      width: '520px',
                      height: '120px',
                      clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div className="text-center px-4 py-2">
                      <h3 className="text-lg font-bold text-[#243D66] leading-tight">On-the-Ground Carbon Assets</h3>
                    </div>
                  </div>
                  {/* Icon */}
                  <div className="absolute -right-32 top-1/2 transform -translate-y-1/2">
                    <div className="w-12 h-12 bg-[#D97A45] rounded-full flex items-center justify-center">
                      <Anchor className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 lg:px-12 lg:py-24 bg-[#243D66]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8">
            Ready to explore impact ventures?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Access our curated portfolio of regenerative economy projects and discover opportunities 
            that create positive environmental and social impact.
          </p>
          <Button 
            onClick={onNavigateToProjectRoom}
            className="bg-[#D97A45] hover:bg-[#c16a3a] text-white px-12 py-4 text-xl font-medium rounded-full"
          >
            Access Impact Project Library
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 lg:px-12 bg-white border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-[#D97A45] rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[#243D66]">
              Kick<span className="text-[#D97A45]">Impact</span>
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2024 KickImpact. Shaping the regenerative economy.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;