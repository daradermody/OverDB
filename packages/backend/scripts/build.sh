rm -rf build/*
mkdir -p build/unbundled
yarn esbuild --bundle --platform=node src/index.ts --define:process.env.NODE_ENV=\"production\" --external:canvas --external:./xhr-sync-worker.js > build/unbundled/backend.js
touch build/unbundled/xhr-sync-worker.js
cp src/schema.graphql build/unbundled
yarn nexe --input build/unbundled/backend.js --output build/backend --target linux-x64-14.15.3 --resource build/unbundled/schema.graphql --resource build/unbundled/xhr-sync-worker.js
