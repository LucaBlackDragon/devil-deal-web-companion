const { PHASE_PRODUCTION_BUILD } = require("next/constants");

/**
 *
 * @param {string} phase
 * @param {{defaultConfig: import('next').NextConfig}} param1
 * @returns {import('next').NextConfig}
 */
module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    console.log("PRODUCTION CONFIG");
    return {
      ...defaultConfig,
      output: "export",
      basePath: "/devildeal",
    };
  }

  console.log("DEVELOPMENT CONFIG");
  return {
    ...defaultConfig,
  };
};
