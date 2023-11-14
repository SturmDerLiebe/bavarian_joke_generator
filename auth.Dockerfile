FROM node:lts-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod
RUN pnpm install -r --offline --prod
USER node
COPY --chown=node:node api/auth/ api/auth/
COPY --chown=node:node RegEx/ RegEx/
COPY --chown=node:node constants/db.js constants/
COPY --chown=node:node constants/auth.js constants/
COPY --chown=node:node helpers/auth/ helpers/auth/
COPY --chown=node:node helpers/database/user/ helpers/database/user/
COPY --chown=node:node helpers/database/authenticator/ helpers/database/authenticator/
COPY --chown=node:node library/ library/
EXPOSE 4200
CMD [ "node", "api/auth/main.js" ]

