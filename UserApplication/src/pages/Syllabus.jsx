import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, LearningPaths } from '../services/api';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const pathInfo = {
  [LearningPaths.PYTHON]: {
    name: 'Python',
    emoji: '🐍',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
  },
  [LearningPaths.WEB_DEVELOPMENT]: {
    name: 'Web Development',
    emoji: '🌐',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    iconBg: 'bg-cyan-500/20',
  },
  [LearningPaths.MOBILE_DEVELOPMENT]: {
    name: 'Mobile Development',
    emoji: '📱',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    iconBg: 'bg-violet-500/20',
  },
};

const difficultyInfo = {
  beginner: { name: 'Beginner', emoji: '🌱', color: 'from-green-400 to-green-500' },
  intermediate: { name: 'Intermediate', emoji: '🌿', color: 'from-amber-400 to-amber-500' },
  advanced: { name: 'Advanced', emoji: '🌳', color: 'from-red-400 to-red-500' },
};

export default function Syllabus() {
  const [loading, setLoading] = useState(true);
  const [pathsData, setPathsData] = useState([]);
  const [unitsByPath, setUnitsByPath] = useState({});
  const [modulesByUnit, setModulesByUnit] = useState({});
  const [unassignedModules, setUnassignedModules] = useState({});
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSyllabusData();
  }, []);

  const loadSyllabusData = async () => {
    try {
      // Fetch all paths
      const paths = await api.getLearningPaths();
      setPathsData(paths);

      // Fetch units and modules for each path
      const dataPromises = paths.map(async (path) => {
        const [units, modules] = await Promise.all([
          api.getUnits({ path_id: path.id }),
          api.getModules({ path_id: path.id })
        ]);

        // Group modules by unit
        const unitModulesMap = {};
        const unassigned = [];

        units.forEach(unit => {
          unitModulesMap[unit.id] = [];
        });

        modules.forEach(module => {
          if (module.unit_id && unitModulesMap[module.unit_id]) {
            unitModulesMap[module.unit_id].push(module);
          } else {
            unassigned.push(module);
          }
        });

        // Sort modules within each unit by order
        Object.keys(unitModulesMap).forEach(unitId => {
          unitModulesMap[unitId].sort((a, b) => (a.order || 0) - (b.order || 0));
        });

        return {
          pathId: path.id,
          units,
          unitModulesMap,
          unassigned
        };
      });

      const results = await Promise.all(dataPromises);

      const unitsMap = {};
      const modulesMap = {};
      const unassignedMap = {};

      results.forEach(({ pathId, units, unitModulesMap, unassigned }) => {
        unitsMap[pathId] = units;
        Object.keys(unitModulesMap).forEach(unitId => {
          modulesMap[unitId] = unitModulesMap[unitId];
        });
        unassignedMap[pathId] = unassigned;
      });

      setUnitsByPath(unitsMap);
      setModulesByUnit(modulesMap);
      setUnassignedModules(unassignedMap);
    } catch (err) {
      console.error('Failed to load syllabus:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedPathData = pathsData.find(p => p.id === selectedPath);
  const selectedUnits = selectedPath ? unitsByPath[selectedPath] || [] : [];
  const selectedUnitData = selectedUnits.find(u => u.id === selectedUnit);
  const selectedModules = selectedUnit ? modulesByUnit[selectedUnit] || [] :
                          (selectedPath && !selectedUnit ? unassignedModules[selectedPath] || [] : []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-gray-600 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-300 mt-4 font-medium">Loading syllabus...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 border border-red-500 text-red-400 px-6 py-4 rounded-xl">
          <p className="font-semibold">Failed to load syllabus</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-950 text-white h-screen flex flex-col justify-center overflow-hidden snap-start"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-800 to-indigo-950 bg-[length:200%_200%] animate-gradient opacity-90"></div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 text-center"
          variants={fadeInUp}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">Syllabus</h1>
          <p className="text-xl sm:text-2xl opacity-95">Choose your learning path to explore our curriculum</p>
        </motion.div>
      </motion.section>

      {/* Content Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen px-4 sm:px-6 lg:px-8 snap-start">
        <div className="max-w-7xl mx-auto w-full min-h-screen flex flex-col">
          <AnimatePresence mode="wait">
          {selectedPath === null ? (
            // View 1: Path Selection Cards
            <motion.div
              key="path-selection"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              variants={staggerContainer}
              className="flex-1 flex items-center justify-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
              {pathsData.map((path, index) => {
                const info = pathInfo[path.id] || pathInfo[LearningPaths.PYTHON];
                const unitCount = unitsByPath[path.id]?.length || 0;

                return (
                  <motion.div
                    key={path.id}
                    variants={scaleIn}
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPath(path.id)}
                    className={`relative ${info.bgColor} border-2 ${info.borderColor} rounded-2xl p-10 pb-16 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 transition-all duration-300 group`}
                  >
                    {/* Icon */}
                    <motion.div
                      className={`${info.iconBg} w-32 h-32 rounded-2xl flex items-center justify-center text-7xl mb-8 mx-auto group-hover:scale-110 transition-transform duration-300`}
                      animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {info.emoji}
                    </motion.div>

                    {/* Path Name */}
                    <motion.h3
                      className="text-3xl font-bold text-white text-center mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {info.name}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      className="text-gray-400 text-center text-base mb-6 line-clamp-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      {path.description || 'Learn programming through hands-on projects'}
                    </motion.p>

                    {/* Unit Count Badge */}
                    <motion.div
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="bg-gray-800/80 px-5 py-3 rounded-full">
                        <span className="text-purple-400 font-bold text-lg">{unitCount}</span>
                        <span className="text-gray-400 ml-1">units</span>
                      </div>
                    </motion.div>

                    {/* Hover indicator */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-purple-400 text-base">
                        <span>Click to explore</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </div>
            </motion.div>
          ) : selectedUnit === null ? (
            // View 2: Unit Selection Cards
            <motion.div
              key="unit-selection"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              variants={staggerContainer}
              className="pt-8"
            >
              {/* Back Button */}
              <button
                onClick={() => setSelectedPath(null)}
                className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors duration-200 group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to all paths</span>
              </button>

              {/* Selected Path Header */}
              {selectedPathData && (() => {
                const info = pathInfo[selectedPathData.id] || pathInfo[LearningPaths.PYTHON];
                return (
                  <div className="flex items-center gap-6 mb-8">
                    <div className={`${info.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center text-5xl`}>
                      {info.emoji}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{info.name}</h2>
                      <p className="text-gray-400 mt-1">{selectedPathData.description || ''}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Units Grid */}
              {selectedUnits.length > 0 || (unassignedModules[selectedPath]?.length > 0) ? (
                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {/* Unit Cards */}
                  {selectedUnits.map((unit, index) => {
                    const moduleCount = modulesByUnit[unit.id]?.length || 0;
                    const info = pathInfo[selectedPath] || pathInfo[LearningPaths.PYTHON];
                    return (
                      <motion.div
                        key={unit.id}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedUnit(unit.id)}
                        className={`relative ${info.bgColor} border-2 ${info.borderColor} rounded-xl p-6 cursor-pointer hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group`}
                      >
                        {/* Order Badge */}
                        <div className="absolute top-4 right-4 bg-gray-800/80 px-3 py-1 rounded-full text-xs font-semibold text-gray-400">
                          #{unit.order}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-white mb-3 pr-12">{unit.title}</h3>

                        {/* Description */}
                        {unit.description && (
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{unit.description}</p>
                        )}

                        {/* Module Count */}
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{moduleCount} modules</span>
                        </div>

                        {/* Hover indicator */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Unassigned Modules Card (if any exist) */}
                  {unassignedModules[selectedPath]?.length > 0 && (
                    <motion.div
                      key="unassigned"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedUnit('unassigned')}
                      className="relative bg-gray-800 border-2 border-gray-700 rounded-xl p-6 cursor-pointer hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group"
                    >
                      {/* Icon */}
                      <div className="absolute top-4 right-4 w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
                        <span className="text-xl">📋</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-white mb-3">Unassigned Modules</h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-4">Modules not yet assigned to a unit</p>

                      {/* Module Count */}
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{unassignedModules[selectedPath].length} modules</span>
                      </div>

                      {/* Hover indicator */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
                  <p className="text-gray-400">No units available for this path yet.</p>
                </div>
              )}
            </motion.div>
          ) : (
            // View 3: Selected Unit Modules
            <motion.div
              key={selectedUnit}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="pt-8"
            >
              {/* Back Button */}
              <button
                onClick={() => setSelectedUnit(null)}
                className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors duration-200 group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to units</span>
              </button>

              {/* Selected Unit Header */}
              {(() => {
                if (selectedUnit === 'unassigned') {
                  const info = pathInfo[selectedPath] || pathInfo[LearningPaths.PYTHON];
                  return (
                    <div className="flex items-center gap-6 mb-8">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl bg-gray-700`}>
                        📋
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">Unassigned Modules</h2>
                        <p className="text-gray-400 mt-1">Modules not yet assigned to a unit</p>
                      </div>
                    </div>
                  );
                }
                const unit = selectedUnitData;
                const info = pathInfo[selectedPath] || pathInfo[LearningPaths.PYTHON];
                return (
                  <div className="flex items-center gap-6 mb-8">
                    <div className={`${info.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center text-5xl`}>
                      {info.emoji}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{unit?.title}</h2>
                      {unit?.description && <p className="text-gray-400 mt-1">{unit.description}</p>}
                    </div>
                  </div>
                );
              })()}

              {/* Modules Grid */}
              {selectedModules.length > 0 ? (
                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {selectedModules.map((module) => {
                    const difficulty = difficultyInfo[module.difficulty_level] || difficultyInfo.beginner;
                    return (
                      <motion.div
                        key={module.id}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedModule(module)}
                        className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border border-gray-700 cursor-pointer group relative"
                      >
                        {/* Module Header */}
                        <h3 className="text-xl font-semibold text-white mb-3">{module.title}</h3>

                        {/* Description */}
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{module.description}</p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-3">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${difficulty.color} text-white`}>
                            <span>{difficulty.emoji}</span>
                            <span>{difficulty.name}</span>
                          </div>
                          <div className="text-gray-400 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{module.objectives?.length || 0} objectives</span>
                          </div>
                        </div>

                        {/* Hover indicator */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center gap-2 text-purple-400 text-sm">
                            <span>View details</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
                  <p className="text-gray-400">No modules available for this path yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Module Detail Modal */}
      <AnimatePresence>
        {selectedModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedModule(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 rounded-t-2xl">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${difficultyInfo[selectedModule.difficulty_level]?.color || 'from-gray-400 to-gray-500'} text-white`}>
                    <span>{difficultyInfo[selectedModule.difficulty_level]?.emoji || '📚'}</span>
                    <span>{difficultyInfo[selectedModule.difficulty_level]?.name || 'Beginner'}</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white">{selectedModule.title}</h2>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-purple-400 mb-2">About This Module</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedModule.description}</p>
                </div>

                {/* Learning Objectives */}
                {selectedModule.objectives && selectedModule.objectives.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-purple-400 mb-3">What You'll Learn</h3>
                    <ul className="space-y-3">
                      {selectedModule.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-300">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prerequisites */}
                {selectedModule.prerequisites && selectedModule.prerequisites.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-purple-400 mb-2">Prerequisites</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedModule.prerequisites.map((prereq, i) => (
                        <span key={i} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Module ID */}
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500">Module ID: {selectedModule.id}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
