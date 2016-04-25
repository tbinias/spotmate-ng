FROM httpd:2.4
COPY ./build/dist/spotmate.js /usr/local/apache2/htdocs/
COPY ./app/index.html /usr/local/apache2/htdocs/
COPY ./app/index.html /usr/local/apache2/htdocs/
COPY ./app/partials/ /usr/local/apache2/htdocs/partials/
