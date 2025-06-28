// netlify/plugins/npm-fix/index.js
export const onPreInstall = async () => {
  const { execSync } = await import("node:child_process");

  console.log("🧹 Cleaning npm cache and deleting node_modules...");
  execSync("npm cache clean --force", { stdio: "inherit" });

  // If using the client folder, remove client/node_modules
  try {
    execSync("rm -rf client/node_modules", { stdio: "inherit" });
  } catch (e) {
    console.warn("Could not remove client/node_modules");
  }

  console.log("🔧 Downgrading npm to 9.8.1 before Netlify installs dependencies...");
  execSync("npm install -g npm@9.8.1", { stdio: "inherit" });
};