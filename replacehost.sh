#!/bin.bash

ARR_SEARCH_DIR=("./_blog/_site/*" "./_blog/_posts/*" "blog")
#SEARCH_DIR=./_blog/_assets/*
DEV_URL_HOST=http\:\/\/localhost\:4000
PROD_URL_HOST=https\:\/\/ryoyakawai.com\/blog

# sed -e 's/http:\/\/localhost\:4000/\/\/ryoyakawai.com\/blog/g' index.html
# grep -ril 'http://localhost:4000' ./index.html | xargs -0 sed -i.bak -e 's/http\:\/\/localhost:4000/https\:\/\/ryoyakawai.com\/blog/g'

for SEARCH_DIR in "${ARR_SEARCH_DIR[@]}"
do
    for file in `grep -ril 'http://localhost:4000' ${SEARCH_DIR}`
    do
        echo ${file}
        sed -i".bak" -e "s/http\:\/\/localhost\:4000/https\:\/\/ryoyakawai.com\/blog/g" ${file}
        rm -rf ${file}.bak
    done
done

exit


for file in `grep -ril 'http://localhost:4000' ${SEARCH_DIR}`
do
    echo ${file}
    sed -i".bak" -e "s/http\:\/\/localhost\:4000/https\:\/\/ryoyakawai.com\/blog/g" ${file}
    rm -rf ${file}.bak
done
