
## Functions
function CREATE_NEW_DOT_ENV {
	VARIABLES=(PORT=8080 NODE_ENV=production)
	for VAR in ${VARIABLES[*]}
	do
		echo $VAR >> .env
	done
}

## Variables
OUTDIR=prod
OUTZIP=prod.zip
FILES=(package.json package-lock.json LICENSE.md README.md)
DIRECTORIES=(dist)

## Script
npm run build

# Creating temporary a directory to build the production app
mkdir $OUTDIR

# Copy files
for FILE in ${FILES[*]}
do
	cp $FILE $OUTDIR
done

# Copy directories
for DIR in ${DIRECTORIES[*]}
do
	cp -r $DIR $OUTDIR
done

# Install production dependencies, so it can be runned without npm install when unzipped
cd $OUTDIR
# Create a brand new .env
CREATE_NEW_DOT_ENV
# Install prod dependencies
npm install --only=prod


# This file shouldn't be usefull in production mode, only scripts in package.json are
#rm package-lock.json

# Remove .map files from the builded client
rm dist/client/js/*.map

# Then create the zip file and delete the old one and the directory that used to build the app
cd ..
zip "${OUTZIP}.temp" -r $OUTDIR
mv "${OUTZIP}.temp" $OUTZIP

rm -r $OUTDIR
