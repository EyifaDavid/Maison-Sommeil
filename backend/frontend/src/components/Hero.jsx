import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

import phone1 from "../assets/images/hero1.png";
import phone2 from "../assets/images/hero1.png";
import phone3 from "../assets/images/hero1.png";
import phone4 from "../assets/images/hero1.png";

import look1 from "../assets/images/Loungewear.jpg";
import look2 from "../assets/images/Lingerie.jpg";
import look3 from "../assets/images/Nightwear.jpg";

export default function Hero() {
  const colors = ["#fce7f3", "#e9d5ff", "#dbeafe"]; // side image background colors
  const words = ["imple", "exy", "leepwear"];
  const sideImages = [look1, look2, look3];
  const phoneImages = [phone1, phone2, phone3, phone4];

  const [currentIndex, setCurrentIndex] = useState(0);
  const heroBgRef = useRef(null);
  const sideImageRefs = useRef([]);
  const phoneRefs = useRef([]);

  // Side images and text animation
  useEffect(() => {
    const wordEls = gsap.utils.toArray(".word");

    gsap.set(wordEls, { opacity: 0, y: 50, position: "absolute", left: 0, top: 0 });
    gsap.set(wordEls[0], { opacity: 1, y: 0 });
    gsap.set(sideImageRefs.current, { opacity: 0, y: 50 });
    gsap.set(sideImageRefs.current[0], { opacity: 1, y: 0 });
    gsap.set(heroBgRef.current, { backgroundColor: colors[0] });

    let current = 0;

    const showNext = () => {
      const next = (current + 1) % words.length;

      // Animate text
      gsap.to(wordEls[current], { opacity: 0, y: -50, duration: 0.6, ease: "power2.in" });
      gsap.fromTo(wordEls[next], { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.6 });

      // Animate side images
      gsap.to(sideImageRefs.current[current], { opacity: 0, y: -50, duration: 0.6, ease: "power2.in" });
      gsap.fromTo(sideImageRefs.current[next], { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.6 });

      // Animate background color
      gsap.to(heroBgRef.current, { backgroundColor: colors[next], duration: 1, ease: "power2.inOut" });

      current = next;
      setCurrentIndex(next);
    };

    const interval = setInterval(showNext, 2500);
    return () => clearInterval(interval);
  }, []);

  // Phone carousel animation
  useEffect(() => {
    gsap.set(phoneRefs.current, { opacity: 0 });
    gsap.set(phoneRefs.current[0], { opacity: 1 });

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % phoneImages.length;
      gsap.to(phoneRefs.current[currentIndex], { opacity: 0, duration: 0.6 });
      gsap.to(phoneRefs.current[nextIndex], { opacity: 1, duration: 0.6 });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, phoneImages.length]);

  return (
    <section className="relative flex flex-col mb-15 items-center justify-center w-full overflow-hidden min-h-[500px]">
      {/* Phone carousel */}
      <div className="relative w-full h-full">
        {phoneImages.map((img, i) => (
          <img
            key={i}
            ref={(el) => (phoneRefs.current[i] = el)}
            src={img}
            alt={`Phone ${i + 1}`}
            className="absolute inset-0 w-full h-full object-cover rounded-md shadow-lg"
          />
        ))}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {phoneImages.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${i === currentIndex ? "bg-pink-500" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Animated text and side images */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 p-5 min-h-[400px] w-full max-w-6xl">
        {/* Animated text */}
        <div className="hero-text flex items-center text-5xl md:text-6xl font-bold relative">
          <span className="text-pink-500 text-8xl md:text-9xl">S</span>
          <span className="relative mt-10 inline-block overflow-hidden h-[70px] w-[200px] md:w-[300px]">
            {words.map((w, i) => (
              <span key={i} className="word block">{w}</span>
            ))}
          </span>
        </div>

        {/* Animated side images */}
        <div
          ref={heroBgRef}
          className="hero-images w-full md:mt-20 h-full items-center grid grid-cols-3 gap-4 relative"
        >
          {sideImages.map((img, i) => (
            <img
              key={i}
              ref={(el) => (sideImageRefs.current[i] = el)}
              src={img}
              alt={`Look ${i + 1}`}
              className="w-full md:w-[500px] h-[300px] md:h-[350px] object-cover rounded-md shadow-lg absolute top-0 left-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
