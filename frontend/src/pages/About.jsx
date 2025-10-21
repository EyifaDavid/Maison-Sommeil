import { useEffect, useRef, useState } from "react";
import { Heart, Award, Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    story: false,
    values: false,
    stats: false,
    mission: false
  });

  const [statsAnimated, setStatsAnimated] = useState(false);
  
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const statsRef = useRef(null);
  const missionRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.getAttribute('data-section');
          setVisibleSections(prev => ({ ...prev, [sectionName]: true }));
          
          // Trigger stats animation when stats section becomes visible
          if (sectionName === 'stats' && !statsAnimated) {
            setStatsAnimated(true);
            animateStats();
          }
        }
      });
    }, observerOptions);

    // Observe sections
    if (heroRef.current) observer.observe(heroRef.current);
    if (storyRef.current) observer.observe(storyRef.current);
    if (valuesRef.current) observer.observe(valuesRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (missionRef.current) observer.observe(missionRef.current);

    // Hero section appears immediately
    setVisibleSections(prev => ({ ...prev, hero: true }));

    return () => observer.disconnect();
  }, [statsAnimated]);

  const animateStats = () => {
    const statElements = document.querySelectorAll('.stat-number');
    statElements.forEach((el) => {
      const targetValue = parseInt(el.getAttribute('data-value'));
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      
      const updateNumber = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(targetValue * progress);
        el.textContent = currentValue;
        
        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      };
      
      requestAnimationFrame(updateNumber);
    });
  };

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Comfort First",
      description: "Every piece is designed with your comfort in mind, using the softest, most breathable fabrics."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Quality",
      description: "We source only the finest materials and employ meticulous craftsmanship in every garment."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Elegant Design",
      description: "Beautiful nightwear that makes you feel confident and graceful, day or night."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Inclusive Sizing",
      description: "Beautiful sleepwear for every body, with sizes that celebrate all shapes and forms."
    }
  ];

  const stats = [
    { number: 50000, label: "Happy Customers", suffix: "+" },
    { number: 98, label: "Customer Satisfaction", suffix: "%" },
    { number: 500, label: "Designs Created", suffix: "+" },
    { number: 5, label: "Years of Excellence", suffix: "" }
  ];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div 
          ref={heroRef}
          data-section="hero"
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            visibleSections.hero 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            About <span className="text-pink-500">Maison Sommeil</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Crafting dreams through luxurious nightwear since 2025
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div 
            ref={storyRef}
            data-section="story"
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className={`transition-all duration-800 ${
              visibleSections.story 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-12'
            }`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Born from a simple belief that everyone deserves to feel beautiful while they sleep, 
                Maison Sommeil began as a dream to create the perfect nightwear collection.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                What started in a small studio has grown into a beloved brand, but our mission remains 
                the same: to create pieces that blend comfort, style, and elegance seamlessly.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every stitch tells a story of craftsmanship, every fabric choice reflects our commitment 
                to quality, and every design celebrates the beauty of rest and relaxation.
              </p>
            </div>
            <div className={`relative transition-all duration-800 delay-300 ${
              visibleSections.story 
                ? 'opacity-100 translate-x-0 rotate-0' 
                : 'opacity-0 translate-x-12 rotate-6'
            }`}>
              <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-8 transform rotate-3 hover:rotate-1 transition-transform duration-500">
                <div className="bg-white rounded-xl p-6 transform -rotate-6 hover:-rotate-3 transition-transform duration-500">
                  <div className="w-full h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-pink-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4  backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div 
            ref={valuesRef}
            data-section="values"
          >
            <div className={`text-center mb-16 transition-all duration-800 ${
              visibleSections.values 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 text-center hover:scale-105 ${
                    visibleSections.values 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ 
                    transitionDelay: visibleSections.values ? `${index * 150 + 200}ms` : '0ms' 
                  }}
                >
                  <div className="text-pink-500 mb-6 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div 
            ref={statsRef}
            data-section="stats"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 ${
                  visibleSections.stats 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: visibleSections.stats ? `${index * 100}ms` : '0ms' 
                }}
              >
                <div className="text-4xl md:text-5xl font-bold text-pink-500 mb-2">
                  <span className="stat-number" data-value={stat.number}>0</span>
                  {stat.suffix}
                </div>
                <p className="text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-200 to-purple-100">
        <div 
          ref={missionRef}
          data-section="mission"
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            visibleSections.mission 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
            Our Mission
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            "To create beautiful, comfortable nightwear that celebrates every woman's 
            unique style and makes bedtime the most luxurious part of her day."
          </p>
          <div className={`flex flex-col md:flex-row items-center justify-center gap-6 mt-12 transition-all duration-800 delay-500 ${
            visibleSections.mission 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <button className="bg-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-pink-600 hover:scale-105 transition-all duration-300"
            onClick={()=> navigate('/shop')}>
              Shop Our Collection
            </button>
            <button className="border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-full font-semibold hover:bg-pink-50 hover:scale-105 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}