#!/bin/sh

npm i
node_modules/bower/bin/bower install

i18ns=`find i18n -name '*.json' | sed 's/i18n\/\(.*\)\.json/\1/'`

for i18n in $i18ns
do
    echo "I18N=$i18n scrat release"
    I18N="$i18n" scrat release -ompd ../out
done
