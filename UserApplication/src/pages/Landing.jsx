import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import instructorImg from '../assets/me.jpg'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
}

export default function Landing() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Hero Section */}
      <section className="snap-start relative bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-950 text-white min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-800 to-indigo-950 bg-[length:200%_200%] animate-gradient opacity-90"></div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
            variants={fadeInUp}
          >
            UNLOCK YOUR TECH SUPERPOWERS
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl mb-10 opacity-95"
            variants={fadeInUp}
          >
            Learn to code through games and real projects
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={fadeInUp}
          >
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:from-orange-400 hover:to-orange-500"
            >
              Claim Your Free Trial Class
            </Link>
            <Link
              to="/syllabus"
              className="px-8 py-4 bg-transparent text-white border-2 border-purple-400 rounded-full font-semibold text-lg hover:bg-purple-600 hover:border-purple-600 transition-all duration-300"
            >
              View Syllabus
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Learn to Code Section */}
      <section className="snap-start py-8 sm:py-12 bg-gray-900 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.85 }}
            transition={{ duration: 0.6 }}
          >
            Why Learn to Code?
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.85 }}
            variants={staggerContainer}
          >
            {[
              { icon: '🧠', title: 'Enhances Critical Thinking', desc: 'Develop problem-solving skills that apply to all areas of life' },
              { icon: '💪', title: 'Builds Perseverance', desc: 'Learn resilience through debugging and overcoming challenges' },
              { icon: '🚀', title: 'In-Demand Skill', desc: 'Prepare for the future with one of today\'s most valuable skills' },
              { icon: '⚡', title: 'Automate Tasks', desc: 'Build programs that do repetitive work for you' },
              { icon: '🎮', title: 'Create Real Things', desc: 'Build actual apps, websites, and games you can share' },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-xl text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                variants={scaleIn}
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">{benefit.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="snap-start py-8 sm:py-12 bg-gray-800 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-3 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.85 }}
            transition={{ duration: 0.6 }}
          >
            Choose Your Learning Path
          </motion.h2>
          <motion.p
            className="text-center text-gray-300 mb-12 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.85 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Three exciting paths to explore coding
          </motion.p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.85 }}
            variants={staggerContainer}
          >
            {[
              {
                name: 'Python',
                icon: '🐍',
                color: 'border-[#3776ab]',
                desc: 'Start with programming fundamentals through fun projects and games',
                features: ['Perfect for beginners', 'Build games and apps', 'Learn computational thinking']
              },
              {
                name: 'Web Development',
                icon: '🌐',
                color: 'border-[#f7df1e]',
                desc: 'Create your own websites and web applications',
                features: ['HTML, CSS, JavaScript', 'Build real websites', 'Showcase your projects']
              },
              {
                name: 'Mobile Development',
                icon: '📱',
                color: 'border-[#3ddc84]',
                desc: 'Design and build mobile applications',
                features: ['Create iOS and Android apps', 'UI/UX design principles', 'Build portfolio projects']
              },
            ].map((path, index) => (
              <motion.div
                key={index}
                className={`bg-gray-800 border-2 ${path.color} rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
                variants={scaleIn}
              >
                <div className="text-6xl mb-4">{path.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-white">{path.name}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{path.desc}</p>
                <ul className="space-y-2">
                  {path.features.map((feature, i) => (
                    <li key={i} className="text-gray-200 flex items-start">
                      <span className="text-green-500 mr-2 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="snap-start py-8 sm:py-12 bg-gray-900 min-h-screen flex flex-col justify-center">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.85 }}
            variants={staggerContainer}
          >
            <motion.div className="flex-1 w-full" variants={fadeInUp}>
              <h2 className="text-3xl sm:text-4xl font-bold text-center lg:text-left mb-6 text-white">
                Meet Your Instructor
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-400 mb-8 text-center lg:text-left">
                Vedanth Suresh
              </h3>
              <div className="space-y-4">
                {[
                  { icon: '🏆', text: '1st Place - Mobile App & Web Design (State-wide)' },
                  { icon: '🎯', text: 'Regional Winner - Computer Science Competitions' },
                  { icon: '🌟', text: 'Top 10 - Web Design (National)' },
                  { icon: '💻', text: 'Built 30+ Apps, Websites & AI Models' },
                  { icon: '⏱️', text: '300+ Hours Practical Coding Experience' },
                ].map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-sm"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.85 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <span className="text-3xl flex-shrink-0">{achievement.icon}</span>
                    <p className="text-gray-200 font-medium m-0">{achievement.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="flex-shrink-0 flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.85 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-2xl animate-float border-4 border-white">
                <img
                  src={instructorImg}
                  alt="Vedanth Suresh"
                  className="w-full h-full object-cover object-[50%_10%]"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="snap-start py-8 sm:py-12 bg-gray-900 min-h-screen flex flex-col justify-center">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.85 }}
            transition={{ duration: 0.6 }}
          >
            Simple, Affordable Pricing
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.85 }}
            variants={staggerContainer}
          >
            <motion.div
              className="bg-gray-800 rounded-2xl p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              variants={scaleIn}
            >
              <h3 className="text-2xl font-semibold mb-4 text-white">Group Lessons</h3>
              <div className="text-5xl font-extrabold text-purple-400 mb-8">
                $8<span className="text-base font-normal text-gray-400">/session</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                {['Small group sizes', '45-minute sessions', 'Learn with peers', 'Ages 6-12'].map((feature, i) => (
                  <li key={i} className="text-gray-300 border-b border-gray-600 pb-3 last:border-0">{feature}</li>
                ))}
              </ul>
              <Link
                to="/register"
                className="inline-block px-8 py-3 border-2 border-purple-600 text-purple-400 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300"
              >
                Get Started
              </Link>
            </motion.div>
            <motion.div
              className="bg-gray-800 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 relative border-2 border-purple-600"
              variants={scaleIn}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-700 text-white px-6 py-1 rounded-full text-sm font-semibold animate-pulse">
                Most Popular
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">1-on-1 Lessons</h3>
              <div className="text-5xl font-extrabold text-purple-400 mb-8">
                $10<span className="text-base font-normal text-gray-400">/session</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                {['Personalized attention', '45-minute sessions', 'Customized curriculum', 'Ages 6-12'].map((feature, i) => (
                  <li key={i} className="text-gray-300 border-b border-gray-600 pb-3 last:border-0">{feature}</li>
                ))}
              </ul>
              <Link
                to="/register"
                className="inline-block px-8 py-3 bg-purple-700 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
          <motion.p
            className="text-center mt-8 text-purple-400 font-medium text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.85 }}
          >
            ✨ First class is FREE! Try it risk-free.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="snap-start py-8 sm:py-12 bg-gray-800 min-h-screen flex flex-col justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.85 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Start Coding?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.85 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Have questions? Reach out anytime!
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.85 }}
            variants={staggerContainer}
          >
            <a
              href="mailto:vedanth.suresh039@gmail.com"
              className="flex items-center gap-3 px-6 py-3 bg-gray-700 rounded-full text-white hover:bg-purple-600 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-2xl">📧</span>
              vedanth.suresh039@gmail.com
            </a>
            <a
              href="tel:943-238-1652"
              className="flex items-center gap-3 px-6 py-3 bg-gray-700 rounded-full text-white hover:bg-purple-600 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-2xl">📞</span>
              943-238-1652
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.85 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/register"
              className="inline-block px-10 py-5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white rounded-full font-bold text-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Claim Your Free Trial Class
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
