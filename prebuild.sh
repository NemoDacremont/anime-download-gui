
# Actually, this isn't necessary, I should build in temporary dir instead of deleting
# previous build and the mv it
rm -rf dist

# Build the client
cd client/
npm run build
