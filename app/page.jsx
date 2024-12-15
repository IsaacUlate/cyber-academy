"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] to-[#1F2937] text-white font-sans">
      {/* Hero Section */}
      <section className="text-center py-32 px-6">
        <h1 className="text-5xl font-extrabold mb-6 tracking-wide">
          Empower Your <span className="text-[#3ABFF8]">Cybersecurity</span> Skills
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-300">
          Join thousands of professionals mastering the art of cybersecurity with hands-on labs,
          expert tutorials, and industry certifications.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="#get-started"
            className="px-6 py-3 bg-gradient-to-r from-[#3ABFF8] to-[#10B981] text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
          >
            Get Started
          </a>
          <a
            href="#learn-more"
            className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#3ABFF8] text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-[#161B22] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6 text-center">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-400 text-center mb-12">
            Explore our powerful features designed to help you succeed in the world of cybersecurity.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Real-World Labs", icon: "&#x1F4BB;", description: "Practice in live environments with simulated attacks and defenses." },
              { title: "Expert Tutorials", icon: "&#x1F464;", description: "Learn from cybersecurity experts with years of experience." },
              { title: "Certification Prep", icon: "&#x1F4DA;", description: "Prepare for industry certifications like CompTIA Security+ and CISSP." },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-[#0D1117] rounded-lg shadow hover:shadow-lg transition-all text-center"
              >
                <div className="text-4xl mb-4" dangerouslySetInnerHTML={{ __html: feature.icon }} />
                <h3 className="text-xl font-semibold mb-4 text-[#3ABFF8]">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section id="cta" className="py-16 bg-gradient-to-r from-[#2563EB] to-[#3ABFF8] text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Join Our Cybersecurity Community</h2>
        <p className="text-lg max-w-3xl mx-auto mb-8">
          Start your journey to becoming a cybersecurity expert with hands-on training and
          professional guidance.
        </p>
        <a
          href="#get-started"
          className="px-8 py-4 bg-[#10B981] hover:bg-[#34D399] text-white font-semibold rounded-lg shadow-lg transition"
        >
          Get Started Today
        </a>
      </section>

      
    </div>
  );
}
