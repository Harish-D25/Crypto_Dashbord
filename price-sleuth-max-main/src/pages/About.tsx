
import Navbar from '@/components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 animate-fade-up">About PriceSleuth</h1>
            
            <div className="space-y-6 animate-fade-up delay-100">
              <p className="text-lg">
                PriceSleuth is a cutting-edge cryptocurrency tracking and prediction platform designed for both novice and experienced crypto investors. Our mission is to provide clear, accurate, and timely information about cryptocurrency markets in an elegant and easy-to-use interface.
              </p>
              
              <h2 className="text-2xl font-semibold mt-10">Our Vision</h2>
              <p>
                We believe that financial information should be accessible, understandable, and beautiful. By combining real-time price data with predictive analytics, we aim to give users insights that help them make informed decisions in the volatile world of cryptocurrency.
              </p>
              
              <h2 className="text-2xl font-semibold mt-10">Key Features</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Live price tracking for major cryptocurrencies</li>
                <li>Historical price charts with multiple time frames</li>
                <li>Price prediction based on advanced algorithms</li>
                <li>Currency conversion tools</li>
                <li>Detailed market statistics</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-10">Our Approach</h2>
              <p>
                PriceSleuth combines technological expertise with a dedication to design excellence. We focus on creating a platform that is:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Minimalist and intuitive, removing unnecessary complexity</li>
                <li>Highly responsive, providing a seamless experience across all devices</li>
                <li>Focused on essential information, avoiding information overload</li>
                <li>Beautiful and refined, making data exploration enjoyable</li>
              </ul>
              
              <div className="glass-panel p-8 mt-10 text-center">
                <h3 className="text-xl font-medium mb-4">Stay Updated</h3>
                <p className="mb-6">Subscribe to our newsletter to receive the latest updates and insights about cryptocurrency markets.</p>
                
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="glass-input flex-1"
                  />
                  <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
