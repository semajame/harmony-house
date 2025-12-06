import Carousel from "@/components/home/carousel";

import Contact from "@/components/home/contact";
import FoodDrinks from "@/components/home/food-drink";

import Rooms from "@/components/home/rooms";
import { Music } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* hero main */}
      <main
        className="relative min-h-screen bg-cover bg-center text-white text-center flex justify-center items-center"
        style={{ backgroundImage: "url('/images/hero-image.jpg')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 z-0" />

        {/* Content */}
        <div className="relative z-10 px-4 flex gap-7 flex-col items-center pt-20 md:pt-32">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-serif italic">
              Harmony House
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-2 my-2">
              <Music className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              <span className="text-lg sm:text-xl md:text-2xl font-light tracking-widest text-purple-200">
                K.T.V EXPERIENCE
              </span>
              <Music className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
          </div>

          <p className="text-base sm:text-lg md:text-xl max-w-[700px] m-auto font-semibold">
            Sing your heart out at Harmony House! Experience premium KTV rooms
            with top-tier sound systems, extensive song libraries, and
            unforgettable moments with friends.
          </p>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 text-center mb-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                4
              </div>
              <div className="text-sm text-gray-300">Premium Rooms</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl font-bold text-pink-400">
                50K+
              </div>
              <div className="text-sm text-gray-300">Songs Available</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                24/7
              </div>
              <div className="text-sm text-gray-300">Open Daily</div>
            </div>
          </div>

          <Link
            href="/room"
            className="bg-[#944EA8] w-[150px] m-auto py-3 rounded-md cursor-pointer hover:bg-[#7f3a93] transition"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* rooms */}
      <Rooms />

      <Carousel />

      <FoodDrinks />

      {/* contact title */}
      <div className="bg-[#944EA8] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg text-gray-100 max-w-2xl mx-auto">
              We'd love to hear from you. Get in touch for questions,
              reservations, or feedback about your stay.
            </p>
          </div>
        </div>
      </div>

      {/* contact component */}
      <Contact />
    </div>
  );
}
