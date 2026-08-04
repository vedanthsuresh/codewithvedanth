import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

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

export default function About() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
        {/* Header */}
        <motion.section
          className="snap-start h-screen flex flex-col justify-center bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-950"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Code with Vedanth</h1>
            <p className="text-xl text-gray-300">Empowering the next generation of coders</p>
          </div>
        </motion.section>

        {/* Instructor Bio Section */}
        <motion.section
          className="snap-start h-screen flex flex-col justify-center bg-gray-900"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={staggerContainer}
        >
          <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-white mb-8 text-center"
            variants={fadeInUp}
          >
            Your Instructor
          </motion.h2>
          <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
            <motion.div
              className="flex flex-col md:flex-row gap-8 items-center"
              variants={fadeInUp}
            >
              <div className="flex-shrink-0">
                <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-purple-600 shadow-2xl">
                  <img
                    src="/src/assets/me.jpg"
                    alt="Vedanth Suresh"
                    className="w-full h-full object-cover object-[50%_10%]"
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-purple-400 mb-4">Vedanth Suresh</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  I'm a passionate developer and educator with extensive experience in building apps, websites, and AI models.
                  My goal is to make coding fun and accessible for students of all ages.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: '🏆', text: '1st Place - Mobile App & Web Design (State-wide)' },
                    { icon: '🎯', text: 'Regional Winner - Computer Science Competitions' },
                    { icon: '🌟', text: 'Top 10 - Web Design (National)' },
                    { icon: '💻', text: '30+ Apps, Websites & AI Models Built' },
                    { icon: '⏱️', text: '300+ Hours Practical Coding Experience' },
                    { icon: '🎓', text: 'Passionate About Teaching' },
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <span className="text-gray-200">{achievement.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        </motion.section>

        {/* Teaching Philosophy */}
        <motion.section
          className="snap-start h-screen flex flex-col justify-center bg-gray-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={staggerContainer}
        >
          <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-white mb-8 text-center"
            variants={fadeInUp}
          >
            Teaching Philosophy
          </motion.h2>
          <motion.div
            className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl p-8 md:p-12 border border-purple-800"
            variants={fadeInUp}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Learn by Doing</h3>
                <p className="text-gray-300 leading-relaxed">
                  Coding is best learned through hands-on practice. My lessons focus on building real projects,
                  games, and applications that students can be proud of.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Personalized Attention</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every student learns differently. I tailor my teaching approach to each individual's pace and
                  learning style, ensuring no one gets left behind.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Building Confidence</h3>
                <p className="text-gray-300 leading-relaxed">
                  Beyond teaching code, I help students develop problem-solving skills, critical thinking,
                  and the confidence to tackle any challenge.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Fun & Engaging</h3>
                <p className="text-gray-300 leading-relaxed">
                  Learning should be enjoyable! I incorporate games, interactive exercises, and creative
                  projects to keep students engaged and excited about coding.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        </motion.section>

        {/* Learning Paths */}
        <motion.section
          className="snap-start h-screen flex flex-col justify-center bg-gray-900"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={staggerContainer}
        >
          <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-white mb-8 text-center"
            variants={fadeInUp}
          >
            What You'll Learn
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={fadeInUp}
          >
            {[
              {
                title: 'Python Programming',
                icon: '🐍',
                description: 'Start your coding journey with Python, perfect for beginners. Learn programming fundamentals through games and projects.',
                topics: ['Variables & Data Types', 'Loops & Conditionals', 'Functions & Modules', 'Object Oriented Programming']
              },
              {
                title: 'Web Development',
                icon: '🌐',
                description: 'Build your own websites from scratch. Learn HTML, CSS, and JavaScript to create stunning web applications.',
                topics: ['HTML Structure', 'CSS Styling', 'JavaScript Interactivity', 'Responsive Design']
              },
              {
                title: 'Mobile Development',
                icon: '📱',
                description: 'Design and build mobile applications. Learn UI/UX principles and create apps for iOS and Android.',
                topics: ['Flutter & Dart', 'User Interface', 'Mobile UI/UX', 'Portfolio Projects']
              },
            ].map((path, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-600 transition-colors">
                <div className="text-4xl mb-4">{path.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{path.title}</h3>
                <p className="text-gray-300 mb-4 text-sm">{path.description}</p>
                <ul className="space-y-2">
                  {path.topics.map((topic, i) => (
                    <li key={i} className="text-gray-400 text-sm flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          className="snap-start h-screen flex flex-col justify-center overflow-y-auto bg-gray-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={staggerContainer}
        >
          <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-2xl font-bold text-white mb-4 text-center"
            variants={fadeInUp}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.div
            className="space-y-3"
            variants={fadeInUp}
          >
            {[
              {
                question: 'What age group do you teach?',
                answer: 'I teach students ranging from 6-12 years old. Everyone learns the same material, but depending on the student, I will adjust my pace accordingly.'
              },
              {
                question: 'How long are the lessons?',
                answer: 'Each lesson is 45 minutes long - the perfect duration to keep students engaged without overwhelming them.'
              },
              {
                question: 'What do I need for the lessons?',
                answer: 'All you need is a computer with internet access. I\'ll provide all the materials and resources needed for each lesson.'
              },
              {
                question: 'Can I try a lesson before committing?',
                answer: 'Absolutely! The first class is completely free. It\'s a great way to see if my teaching style works for you.'
              },
              {
                question: 'What\'s the difference between group and 1-on-1 lessons?',
                answer: 'Group lessons ($8/session) are great for learning alongside peers, while 1-on-1 lessons ($10/session) offer personalized attention.'
              },
              {
                question: 'How do I schedule lessons?',
                answer: 'After signing up, we\'ll work together to find a schedule that works for both of us. Lessons are conducted online at convenient times. If you prefer to learn through a different format, please reach out to me and I can see what I can do.'
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-base font-semibold text-purple-400 mb-1">{faq.question}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </motion.div>
        </div>
        </motion.section>

        <motion.section
          className="snap-start h-screen flex flex-col justify-center bg-gray-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={staggerContainer}
        >
        
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4 text-white"
            variants={fadeInUp}
          >
            Ready to Start Coding?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 mb-8"
            variants={fadeInUp}
          >
            Have questions? Reach out anytime!
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
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
            variants={fadeInUp}
          >
            <Link
              to="/register"
              className="inline-block px-10 py-5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white rounded-full font-bold text-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Claim Your Free Trial Class
            </Link>
          </motion.div>
        </div>
      </motion.section>
      </div>
  )
}
