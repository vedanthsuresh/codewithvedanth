export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-950 to-purple-950 text-white py-12 px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Code with Vedanth</h3>
          <p className="text-gray-300 leading-relaxed">
            Unlock your tech superpowers through coding!
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Contact</h3>
          <p className="text-gray-300">Email: vedanth.suresh039@gmail.com</p>
          <p className="text-gray-300">Phone: 943-238-1652</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Quick Links</h3>
          <ul className="list-none p-0 m-0">
            <li className="mb-2">
              <a href="/lessons" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                Lessons
              </a>
            </li>
            <li className="mb-2">
              <a href="/about" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                About
              </a>
            </li>
            <li className="mb-2">
              <a href="/register" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                Free Trial
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center pt-8 mt-8 border-t border-purple-900/50">
        <p className="text-gray-300 m-0">
          &copy; {new Date().getFullYear()} Code with Vedanth. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
