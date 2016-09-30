zip -r apps_tags.zip *.js package.json node_modules

if [ $? -eq 0 ]
    then
        echo apps_tags.zip
fi
