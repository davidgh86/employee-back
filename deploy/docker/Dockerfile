FROM node:16.17.0-alpine
RUN apk --no-cache add git

ARG GITHUB_TOKEN
# RUN apk --no-cache add openssh

# RUN touch /root/.ssh/known_hosts
# Add bitbuckets key
# RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts

RUN mkdir -p /front

WORKDIR /front

RUN git clone https://$GITHUB_TOKEN@github.com/davidgh86/employee.git

WORKDIR /front/employee
RUN git pull

RUN npm install -g @vue/cli@4.5.14
RUN npm install -g @vue/cli-service@4.5.14
RUN npm install -g @vue/cli-plugin-babel@4.5.14
RUN npm install -g @vue/cli-plugin-eslint@4.5.14
RUN npm install -g @vue/cli-plugin-typescript@4.5.14
RUN npm install -g @vue/cli-plugin-router@4.5.14
RUN npm install -g @vue/cli-plugin-unit-jest@4.5.14
RUN npm install -g @vue/cli-plugin-vuex@4.5.14
RUN npm install -g vue-cli-plugin-vuetify@2.5.4

RUN npm install

RUN npm run build_prod

WORKDIR /app

RUN git clone https://$GITHUB_TOKEN@github.com/davidgh86/employee-back.git

WORKDIR /app/employee-back

RUN npm install
RUN npm install -g pm2@5.2.0

RUN mkdir -p /app/employee-back/dist

RUN cp -R /front/employee/dist/* /app/employee-back/dist

EXPOSE 3000
EXPOSE 9200

CMD npm run start