
function BUILD_CLIENT() {
	cd client/
	npm run build
}

#
rm -r dist
BUILD_CLIENT


