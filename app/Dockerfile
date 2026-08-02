# Pinned to the 22 LTS line rather than a frozen 22.14: patch releases carry
# Node's own security fixes, and the lockfile is what keeps builds reproducible.
FROM node:22-alpine AS build
WORKDIR /app
RUN npm install -g pnpm@11.9.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm run build

# Pinned to a minor so a rebuild can't silently pull a new nginx major, while
# still picking up 1.31.x patch fixes.
FROM nginx:1.31-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
