import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  X, 
  Instagram, 
  Facebook, 
  Camera,
  Volume2,
  ChevronDown,
  Sparkles,
  MessageCircle,
  Send
} from 'lucide-react';

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1519225495810-75178319a139?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1465495910483-0d6745ef740d?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&q=80&w=1000"
];

// Floating particles for the background
const FloatingParticles = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', opacity: 0.3 }}>
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: Math.random() * 3 + 1 + 'px',
          height: Math.random() * 3 + 1 + 'px',
          background: '#d4af37',
          borderRadius: '50%',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
        }}
        animate={{
          y: [0, -100, 0],
          opacity: [0, 1, 0],
          x: [0, (Math.random() - 0.5) * 50, 0]
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ))}
  </div>
);

// Scratch Card Component
const ScratchCard = ({ children }: { children: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Fill with gold cover
    const drawCover = () => {
      const gradient = ctx.createLinearGradient(0, 0, 300, 200);
      gradient.addColorStop(0, '#d4af37');
      gradient.addColorStop(1, '#f1e5ac');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 300, 200);

      ctx.fillStyle = '#07110e';
      ctx.font = '14px Montserrat';
      ctx.textAlign = 'center';
      ctx.fillText('Scratch to Reveal', 150, 100);
    };

    drawCover();

    let isDrawing = false;

    const checkScratePercentage = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] === 0) transparentPixels++;
      }
      const percentage = (transparentPixels / (canvas.width * canvas.height)) * 100;
      if (percentage > 20) {
        setIsRevealed(true);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const scratch = (x: number, y: number) => {
      if (isRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
      checkScratePercentage();
    };

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      handleMouseMove(e);
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = ('clientX' in e ? (e as MouseEvent).clientX : (e as TouchEvent).touches[0].clientX) - rect.left;
      const y = ('clientY' in e ? (e as MouseEvent).clientY : (e as TouchEvent).touches[0].clientY) - rect.top;
      scratch(x, y);
    };

    const handleMouseUp = () => {
      isDrawing = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleMouseDown);
    canvas.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleMouseDown);
      canvas.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isRevealed]);

  return (
    <div className="scratch-container">
      <div className="scratch-content">
        {children}
      </div>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={200} 
        className="scratch-canvas"
        style={{ opacity: isRevealed ? 0 : 1, transition: 'opacity 0.5s ease' }}
      />
    </div>
  );
};

// Particle component for fire/blink effect
const ParticleEffect = ({ active }: { active: boolean }) => {
  if (!active) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none' }}>
      <motion.div 
        className="flare-effect"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 20, 0], opacity: [1, 1, 0] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{ 
            x: '50vw', 
            y: '50vh', 
            scale: Math.random() * 2 + 1 
          }}
          animate={{ 
            x: `${50 + (Math.random() - 0.5) * 100}vw`, 
            y: `${50 + (Math.random() - 0.5) * 100}vh`, 
            opacity: 0,
            scale: 0
          }}
          transition={{ duration: 1.2, ease: "easeOut", delay: Math.random() * 0.2 }}
        />
      ))}
    </div>
  );
};

// Custom SVG Illustrations
const PalaceIllustration = () => (
  <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="venue-illustration">
    <path d="M50 180H350M100 180V100M120 180V80M140 180V90M260 180V90M280 180V80M300 180V100M150 180C150 120 250 120 250 180" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4"/>
    <rect x="180" y="60" width="40" height="120" rx="20" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.6"/>
  </svg>
);

const DressCodeIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 60, margin: '0 auto 20px' }}>
    <path d="M20 30C20 20 40 15 50 25C60 15 80 20 80 30C80 50 50 80 50 80C50 80 20 50 20 30Z" stroke="#d4af37" strokeWidth="2"/>
    <path d="M40 90H60" stroke="#d4af37" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SONG_SRC = new URL('../asset/atlasaudio-love-522433.mp3', import.meta.url).href;

const useCountdown = (targetDate: string) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeLeft = useCountdown('2026-06-15T16:00:00');

  const handleOpen = () => {
    setIsOpening(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log("Audio play blocked:", e));
    }
    setTimeout(() => {
      setIsOpen(true);
    }, 1200); 
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleWhatsAppRSVP = (status: string) => {
    if (!formData.name.trim()) {
      alert("Please enter your name first");
      return;
    }
    const phoneNumber = "917862817776";
    const text = `*Wedding RSVP*%0A%0A*Name:* ${formData.name}%0A*Attending:* ${status}${formData.message ? `%0A*Message:* ${formData.message}` : ''}`;
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="main-wrapper">
      <ParticleEffect active={isOpening} />
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            key="gate"
            className="invitation-gate"
            exit={{ opacity: 0, transition: { delay: 1, duration: 0.5 } }}
          >
            {/* Split Doors */}
            <motion.div 
              className="gate-door left"
              animate={isOpening ? { x: '-100%' } : { x: '0%' }}
              transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
            />
            <motion.div 
              className="gate-door right"
              animate={isOpening ? { x: '100%' } : { x: '0%' }}
              transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
            />

            <motion.div 
              className="tap-button-container"
              onClick={handleOpen}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: isOpening ? 1.5 : 1, 
                opacity: isOpening ? 0 : 1 
              }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="tap-circle-main"
                animate={{ boxShadow: ['0 0 0px 0px rgba(212,175,55,0)', '0 0 0px 30px rgba(212,175,55,0.05)', '0 0 0px 60px rgba(212,175,55,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="tap-letter">W</div>
              </motion.div>
              <div style={{ letterSpacing: '8px', fontSize: '0.7rem', marginTop: '15px', color: '#d4af37', opacity: 0.8 }}>TAP TO OPEN</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio 
        ref={audioRef} 
        src={SONG_SRC} 
        loop 
      />

      <motion.div 
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ delay: 0.8, duration: 1.2 }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <FloatingParticles />
        {/* Music Button */}
        <div style={{ position: 'fixed', top: 30, right: 30, zIndex: 1000 }}>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            onClick={toggleMusic}
            style={{ 
              background: isPlaying ? 'rgba(212,175,55,0.1)' : 'transparent', 
              border: '1px solid rgba(212,175,55,0.3)', 
              borderRadius: '8px', 
              padding: '10px', 
              color: '#d4af37',
              cursor: 'pointer'
            }}
          >
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Volume2 size={24} strokeWidth={1} />
            </motion.div>
          </motion.button>
        </div>

        {/* Intro Section */}
        <section className="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div {...fadeIn}>
            <p style={{ letterSpacing: '8px', fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase' }}>We're Getting Married</p>
            <div className="ornament"></div>
            <motion.h1 
              className="hero-names"
              initial={{ letterSpacing: '24px', opacity: 0 }}
              animate={isOpen ? { letterSpacing: '12px', opacity: 1 } : {}}
              transition={{ duration: 2, delay: 1.5 }}
            >
              SAM <br/> & <br/> SOFÍA
            </motion.h1>
            <div className="ornament"></div>
            <p className="script" style={{ fontSize: '1.6rem' }}>Request the honour of your presence</p>
            
            <motion.div 
              style={{ marginTop: 'auto', paddingTop: '100px' }}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p style={{ letterSpacing: '5px', fontSize: '0.75rem', opacity: 0.4 }}>SCROLL</p>
               <ChevronDown size={18} color="#d4af37" style={{ marginTop: '15px', opacity: 0.4 }} />
            </motion.div>
          </motion.div>
        </section>

        {/* Welcome Message */}
        <section style={{ background: 'linear-gradient(to bottom, #07110e, #0a1a15)' }}>
          <motion.div {...fadeIn}>
             <div className="ornament"></div>
             <p className="script" style={{ fontSize: '1.8rem', maxWidth: '800px', margin: '0 auto', lineHeight: 2, padding: '20px' }}>
               "With hearts full of love and joy, we warmly invite you to share in the celebration of our union. Your presence would mean the world to us as we begin this beautiful journey together."
             </p>
             <div className="ornament"></div>
          </motion.div>
        </section>

        {/* Scratch to Reveal */}
        <section id="scratch">
          <motion.div {...fadeIn}>
            <h2 className="script" style={{ fontSize: '3rem', marginBottom: '20px' }}>Scratch to Reveal</h2>
            <div className="ornament"></div>
            <ScratchCard>
              <div style={{ color: '#d4af37' }}>
                <p style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>The Grand Day</p>
                <h3 style={{ fontSize: '2.5rem', margin: '10px 0' }}>JUNE 15, 2026</h3>
                <p style={{ fontSize: '1rem', opacity: 0.8 }}>4:00 PM IST</p>
                <Sparkles size={16} style={{ marginTop: '10px' }} />
              </div>
            </ScratchCard>
          </motion.div>
        </section>

        {/* Countdown */}
        <section id="countdown">
           <motion.div {...fadeIn}>
             <h2 className="script" style={{ fontSize: '3rem', marginBottom: '10px' }}>Counting Down to Forever</h2>
             <div className="ornament"></div>
             <div className="countdown-grid">
                <div className="countdown-box">
                  <span className="countdown-num">{timeLeft.days}</span>
                  <span className="countdown-label">Days</span>
                </div>
                <div className="countdown-box">
                  <span className="countdown-num">{timeLeft.hours}</span>
                  <span className="countdown-label">Hours</span>
                </div>
                <div className="countdown-box">
                  <span className="countdown-num">{timeLeft.minutes}</span>
                  <span className="countdown-label">Min</span>
                </div>
                <div className="countdown-box">
                  <span className="countdown-num">{timeLeft.seconds}</span>
                  <span className="countdown-label">Sec</span>
                </div>
             </div>
           </motion.div>
        </section>

        {/* Carousel Featured Image */}
        <section id="gallery" style={{ padding: '60px 20px' }}>
           <motion.div 
             style={{ cursor: 'zoom-in', maxWidth: '800px', margin: '0 auto', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }} 
             {...fadeIn}
             onClick={() => setSelectedImage(GALLERY_IMAGES[0])}
            >
              <img src={GALLERY_IMAGES[0]} alt="Featured" style={{ width: '100%', display: 'block' }} />
           </motion.div>
        </section>

        {/* New Gallery Moments Section */}
        <section id="moments" style={{ padding: '80px 20px' }}>
          <motion.div {...fadeIn}>
             <h2 className="script" style={{ fontSize: '3.5rem' }}>Our Precious Moments</h2>
             <div className="ornament"></div>
             <div style={{ 
               display: 'grid', 
               gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
               gap: '20px',
               marginTop: '40px' 
             }}>
                {GALLERY_IMAGES.slice(1).map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 1 : -1 }}
                    style={{ 
                      borderRadius: '15px', 
                      overflow: 'hidden', 
                      height: '350px', 
                      cursor: 'zoom-in',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(212,175,55,0.1)'
                    }}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`Moment ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </motion.div>
                ))}
             </div>
          </motion.div>
        </section>

        {/* Program Timeline */}
        <section id="timeline">
           <motion.div {...fadeIn}>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ border: '1px solid #d4af37', borderRadius: '50%', padding: '10px' }}><Clock size={24} color="#d4af37" /></div>
                <h2 className="script" style={{ fontSize: '3rem' }}>Program Timeline</h2>
             </div>
             <div className="ornament"></div>
             <div className="timeline-container">
                {[
                  { time: "4:00 PM", title: "Guest Arrival" },
                  { time: "5:00 PM", title: "Wedding Ceremony" },
                  { time: "6:30 PM", title: "Cocktail Hour" },
                  { time: "7:00 PM", title: "Dinner Reception" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="timeline-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 10, transition: { duration: 0.3 } }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                     <span className="timeline-time">{item.time}</span>
                     <h3 className="timeline-title">{item.title}</h3>
                  </motion.div>
                ))}
             </div>
           </motion.div>
        </section>

        {/* Venue */}
        <section id="venue">
           <motion.div {...fadeIn}>
              <div style={{ border: '1px solid #d4af37', borderRadius: '50%', padding: '10px', width: 'max-content', margin: '0 auto 20px' }}><MapPin size={24} color="#d4af37" /></div>
              <h2 className="script" style={{ fontSize: '3rem' }}>Venue</h2>
              <div className="ornament"></div>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>The Grand Palace</h3>
              <p style={{ opacity: 0.6, fontSize: '1.2rem', letterSpacing: '1px' }}>123 Royal Avenue, London</p>
              
              <PalaceIllustration />
              
              <button className="btn-gold" style={{ marginTop: '40px' }}>View on Google Maps</button>
           </motion.div>
        </section>

        {/* Dress Code */}
        <section id="dress-code">
           <motion.div {...fadeIn}>
              <DressCodeIcon />
              <h2 className="script" style={{ fontSize: '3rem' }}>Dress Code</h2>
              <div className="ornament"></div>
              
              <div className="dress-code-box">
                 <h3 style={{ fontSize: '2rem', marginBottom: '20px', color: '#d4af37' }}>Formal Elegant</h3>
                 <p style={{ opacity: 0.8 }}>We kindly ask our guests to arrive in black tie attire.</p>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: '40px' }}>
                    <div>
                       <p style={{ fontWeight: 600, marginBottom: '10px' }}>MEN</p>
                       <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Tuxedo or a formal dark suit with a tie.</p>
                    </div>
                    <div>
                       <p style={{ fontWeight: 600, marginBottom: '10px' }}>WOMEN</p>
                       <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Evening gown or formal cocktail dress.</p>
                    </div>
                 </div>
              </div>
           </motion.div>
        </section>

        {/* RSVP Form */}
        <section id="rsvp">
           <motion.div {...fadeIn}>
              <h2 className="script" style={{ fontSize: '4rem' }}>Will You Join Us?</h2>
              <p style={{ margin: '20px 0 40px', opacity: 0.6 }}>Please RSVP before May 15, 2026</p>
              
              <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
                 <div className="form-group" style={{ marginBottom: '25px' }}>
                    <label style={{ color: '#d4af37', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Your Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(212,175,55,0.3)', padding: '15px 0', color: 'white', outline: 'none' }} 
                    />
                 </div>

                 <div className="form-group" style={{ marginBottom: '35px' }}>
                    <label style={{ color: '#d4af37', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Message for the Couple (Optional)</label>
                    <textarea 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Send us a warm wish..."
                      rows={2}
                      style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(212,175,55,0.3)', padding: '15px 0', color: 'white', outline: 'none', resize: 'none' }} 
                    ></textarea>
                 </div>

                 <div className="form-group" style={{ marginBottom: '40px' }}>
                    <label style={{ color: '#d4af37', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Confirm Attendance via WhatsApp</label>
                    <div className="rsvp-buttons">
                       <button className="btn-gold" onClick={() => handleWhatsAppRSVP("Yes, I'm coming!")}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                             <MessageCircle size={18} />
                             YES, I'M COMING
                          </div>
                       </button>
                       <button className="btn" onClick={() => handleWhatsAppRSVP("Sorry, can't make it")}>
                          SORRY, CAN'T MAKE IT
                       </button>
                    </div>
                 </div>

                 <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <p style={{ opacity: 0.4, fontSize: '0.8rem', letterSpacing: '1px' }}>Or click below to send a direct message</p>
                    <a 
                      href="https://wa.me/917862817776" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="script"
                      style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px', textDecoration: 'none' }}
                    >
                      <Send size={24} /> Chat with us
                    </a>
                 </div>
              </div>
           </motion.div>
        </section>

        <footer style={{ padding: '80px 20px', textAlign: 'center', opacity: 0.4 }}>
           <p style={{ letterSpacing: '4px', fontSize: '0.7rem' }}>WITH LOVE, SAM & SOFÍA</p>
        </footer>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <X className="close-lightbox" size={40} />
            <motion.img 
              src={selectedImage} 
              alt="Gallery Preview" 
              className="lightbox-img"
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
