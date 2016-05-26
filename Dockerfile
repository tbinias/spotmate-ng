FROM helder/nginx-extras
COPY ./build/dist/spotmate.js /usr/share/nginx/html/
COPY ./app/index.html /usr/share/nginx/html/
COPY ./app/index.html /usr/share/nginx/html/
COPY ./app/partials/ /usr/share/nginx/html/partials/
COPY ./app/icons/ /usr/share/nginx/html/icons/
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.template /etc/nginx/conf.d/default.conf
