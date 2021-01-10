
#npm run build

mkdir prod

FILES=(.env package.json package-lock.json LICENSE.md README.md)
DIRECTORIES=(dist)

for FILE in ${FILES[*]}
do
	cp FILE prod/
done

for DIR in ${DIRECTORIES[*]}
do
	cp -r DIR prod/
done

cd prod
npm install --only=prod

# This file shouldn't be usefull in production mode, only scripts in package.json are
rm package-lock.json


cd ..
zip prod.zip -d prod
tree prod

rm -r prod

