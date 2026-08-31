// Same issue as mobile/metro.config.js: this app lives nested inside the
// NavUrja repo, next to the unrelated Next.js web app's (and the mobile/
// app's) own node_modules — Metro's default hierarchical lookup would
// otherwise walk up and find the web app's react@19.2.8 alongside this
// project's own react, producing two copies of React in the bundle.
//
// `resolver.disableHierarchicalLookup` looks like the fix and isn't: it
// also breaks Metro's resolution of Expo's own internal packages (e.g.
// @expo/metro-runtime failed to resolve at all with it enabled).
// Blocking just the root project's node_modules path is narrower and
// leaves normal resolution intact for everything actually inside this
// project. (Sibling directories like ../mobile are never reached by
// hierarchical lookup in the first place — it only walks up through
// ancestor directories — so nothing needs to be said about that here.)
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const exclusionList = require("metro-config/private/defaults/exclusionList").default;

const config = getDefaultConfig(__dirname);

const rootNodeModules = path.resolve(__dirname, "..", "node_modules");
const escaped = rootNodeModules.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
config.resolver.blockList = exclusionList([new RegExp(`^${escaped}/.*$`)]);

module.exports = config;
