// netlify/plugins/npm-setup/index.js
export const onPreBuild = async () => {
  const { execSync } = await import('node:child_process');
  console.log("🔧 Downgrading npm to 9.8.1 before install...");
  execSync('npm install -g npm@9.8.1', { stdio: 'inherit' });
};
