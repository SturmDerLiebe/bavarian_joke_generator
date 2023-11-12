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
COPY --chown=node:node api/ api/
COPY --chown=node:node constants/database.js constants/
COPY --chown=node:node constants/api.js constants/
COPY --chown=node:node helpers/api/ helpers/api/
COPY --chown=node:node helpers/database/ helpers/database/
COPY --chown=node:node library/ library/
COPY --chown=node:node views/ views/
EXPOSE 4100
CMD [ "node", "api/ssr/main.js" ]
