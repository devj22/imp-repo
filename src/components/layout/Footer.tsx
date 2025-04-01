import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#50312F] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">Nainaland Deals</h3>
            <p className="text-gray-300 mb-6">
              Your trusted partner in land property investments. Offering premium land properties across South India since 2010.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-white transition">Properties</Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition">Blog</Link>
              </li>
              <li>
                <a href="/#about" className="text-gray-300 hover:text-white transition">About Us</a>
              </li>
              <li>
                <a href="/#contact" className="text-gray-300 hover:text-white transition">Contact Us</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Properties</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/properties?type=Residential" className="text-gray-300 hover:text-white transition">
                  Residential Plots
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Agricultural" className="text-gray-300 hover:text-white transition">
                  Agricultural Land
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Commercial" className="text-gray-300 hover:text-white transition">
                  Commercial Plots
                </Link>
              </li>
              <li>
                <Link href="/properties?type=FarmHouse" className="text-gray-300 hover:text-white transition">
                  Farm Houses
                </Link>
              </li>
              <li>
                <Link href="/properties?featured=true" className="text-gray-300 hover:text-white transition">
                  Premium Plots
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Subscribe</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter to receive updates on new properties and investment opportunities.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="p-3 bg-[#3C2523] text-white rounded-l-md focus:outline-none w-full"
              />
              <button 
                type="button" 
                className="bg-[#FF6B35] px-4 rounded-r-md hover:bg-opacity-90 transition"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-[#3C2523] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Nainaland Deals. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
