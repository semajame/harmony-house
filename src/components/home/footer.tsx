"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const Footer = () => {
  const [open, setOpen] = useState<null | "privacy" | "terms">(null)

  return (
    <footer className="bg-[#944EA8] text-white text-center py-10">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Harmony House KTV. All rights
          reserved.
        </p>

        <div className="mt-10 flex justify-center gap-6 text-sm">
          <button
            onClick={() => setOpen("privacy")}
            className="hover:underline cursor-pointer"
          >
            Privacy Policy
          </button>

          <button
            onClick={() => setOpen("terms")}
            className="hover:underline cursor-pointer"
          >
            Terms of Service
          </button>

          <a href="#contact" className="hover:underline">
            Contact Us
          </a>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <Dialog open={open === "privacy"} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="text-gray-700 space-y-4 text-sm">
            <p>
              <strong>Effective Date:</strong> October 3, 2025
              <br />
              <strong>Last Updated:</strong> October 3, 2025
            </p>
            <p>
              At <strong>Harmony House KTV</strong>, your privacy is very
              important to us. This Privacy Policy explains how we collect, use,
              and protect your information when you use our website, mobile
              services, or visit our establishment.
            </p>

            <h3 className="font-semibold">1. Information We Collect</h3>
            <ul className="list-disc list-inside">
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, and booking details when you make a reservation or
                inquiry.
              </li>
              <li>
                <strong>Payment Information:</strong> Processed securely by our
                third-party providers (we do not store credit card details).
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with our website (e.g., IP address, browser type).
              </li>
            </ul>

            <h3 className="font-semibold">2. How We Use Your Information</h3>
            <ul className="list-disc list-inside">
              <li>To process reservations and provide our services.</li>
              <li>
                To send booking confirmations, updates, and customer support.
              </li>
              <li>
                To improve our services, website, and customer experience.
              </li>
              <li>For legal and regulatory compliance.</li>
            </ul>

            <h3 className="font-semibold">3. Sharing of Information</h3>
            <p>
              We do not sell or rent your personal data. We may share
              information only with trusted service providers (e.g., payment
              processors) or with authorities if required by law.
            </p>

            <h3 className="font-semibold">4. Data Security</h3>
            <p>
              We take reasonable measures to protect your data against
              unauthorized access, alteration, or misuse.
            </p>

            <h3 className="font-semibold">5. Your Rights</h3>
            <p>
              You may request access, correction, or deletion of your personal
              data at any time by contacting us at{" "}
              <strong>[your email/contact info]</strong>.
            </p>

            <h3 className="font-semibold">6. Updates</h3>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with a revised “Last Updated” date.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog open={open === "terms"} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
          </DialogHeader>
          <div className="text-gray-700 space-y-4 text-sm">
            <p>
              <strong>Effective Date:</strong> October 3, 2025
              <br />
              <strong>Last Updated:</strong> October 3, 2025
            </p>
            <p>
              Welcome to <strong>Harmony House KTV</strong>. By using our
              website, booking services, or visiting our establishment, you
              agree to the following terms and conditions.
            </p>

            <h3 className="font-semibold">1. Reservations & Payments</h3>
            <ul className="list-disc list-inside">
              <li>
                Bookings are subject to availability and confirmed once payment
                is processed.
              </li>
              <li>
                Prices may change without prior notice, but confirmed bookings
                remain valid.
              </li>
              <li>
                Cancellation and refund policies will be communicated during
                booking.
              </li>
            </ul>

            <h3 className="font-semibold">2. Use of Facilities</h3>
            <ul className="list-disc list-inside">
              <li>
                Guests are expected to respect our staff, equipment, and other
                customers.
              </li>
              <li>
                Damages caused by negligence may result in additional charges.
              </li>
              <li>
                Alcohol consumption is only permitted for guests of legal
                drinking age.
              </li>
            </ul>

            <h3 className="font-semibold">3. Prohibited Conduct</h3>
            <ul className="list-disc list-inside">
              <li>Engage in unlawful activities.</li>
              <li>Harass or endanger staff or other customers.</li>
              <li>Use our services for commercial purposes without consent.</li>
            </ul>

            <h3 className="font-semibold">4. Limitation of Liability</h3>
            <p>
              Harmony House KTV is not responsible for:
              <ul className="list-disc list-inside ml-4">
                <li>Loss of personal belongings.</li>
                <li>
                  Technical issues beyond our control (e.g., internet outages).
                </li>
                <li>Indirect or incidental damages.</li>
              </ul>
            </p>

            <h3 className="font-semibold">5. Changes to Terms</h3>
            <p>
              We may update these Terms of Service at any time. Continued use of
              our services indicates acceptance of the updated terms.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  )
}

export default Footer
