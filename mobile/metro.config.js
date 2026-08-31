// This app lives nested inside the NavUrja repo, next to the unrelated
// Next.js web app's own node_modules — Metro's default hierarchical
// lookup would otherwise walk up and find that project's react@19.2.8
// alongside this project's own react@19.2.3, producing two copies of
// React in the bundle (broken hooks, "Invalid hook call" errors).
//
// `resolver.disableHierarchicalLookup` looked like the fix but isn't:
// it also breaks Metro's Haste-based resolution of Expo's own internal
// packages (e.g. `@expo/metro-runtime` failed to resolve at all with it
// enabled). Blocking just the sibling project's node_modules path is a
// narrower fix that leaves normal resolution intact for everything
// actually inside this project.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const exclusionList = require("metro-config/private/defaults/exclusionList").default;

const config = getDefaultConfig(__dirname);

const rootNodeModules = path.resolve(__dirname, "..", "node_modules");
const escaped = rootNodeModules.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
config.resolver.blockList = exclusionList([new RegExp(`^${escaped}/.*$`)]);

module.exports = config;
