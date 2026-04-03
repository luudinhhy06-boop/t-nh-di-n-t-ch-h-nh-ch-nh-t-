"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("./Helpers");
class NamespaceDetails {
    constructor() {
        this.parent = null;
        this.name = "";
        this.start = -1;
        this.end = -1;
        this.contentStart = -1;
    }
    /**
     * Generate code for namespace.
     */
    generateCode() {
        let result = "";
        let namespaceNames = this.namespaceNames();
        for (let i in namespaceNames) {
            result += Helpers_1.default.indent("\nnamespace " + namespaceNames[i] + "\n{", Number(i));
        }
        for (let i in namespaceNames) {
            result += Helpers_1.default.indent("\n}", namespaceNames.length - Number(i) - 1);
        }
        return result;
    }
    /**
     * Name including parent namespace name.
     * using for comparison two namespaces.
     */
    fullname() {
        return this.namespaceNames().join('::');
    }
    /**
     * Array of namespace parents and it self.
     */
    namespaceNames() {
        if (this.parent) {
            return this.parent.namespaceNames().concat([this.name]);
        }
        return [this.name];
    }
    /**
     * Depth of nested namespace.
     */
    depth() {
        if (this.parent === null) {
            return 0;
        }
        return this.parent.depth() + 1;
    }
    /**
     * Regex to detect namespaces.
     */
    static namespaceRegex() {
        return "namespace\\s+([\\w_][\\w\\d_:]*)";
    }
    /**
     * Namespace to detect namespace scope.
     */
    static namespaceContentRegex() {
        return Helpers_1.default.scopeRegex;
    }
    /**
     * Parse namespaces
     *
     * @param source
     */
    static parseNamespaces(source) {
        let result = [];
        let namespaceRegex = this.namespaceRegex();
        let namespaceContentRegex = this.namespaceContentRegex();
        let match, match2;
        let regex = new RegExp(namespaceRegex, 'gm');
        while (match = regex.exec(source)) {
            let regex2 = new RegExp(namespaceContentRegex, 'gm');
            if (match2 = regex2.exec(source.substr(match.index + match[0].length - 1))) {
                let namespace = new NamespaceDetails;
                namespace.start = match.index;
                namespace.contentStart = match.index + match[0].length + match2[1].length;
                namespace.end = match.index + match[0].length + match2[0].length;
                namespace.name = match[1];
                for (let i in result) {
                    if (result[i].start < namespace.start && result[i].end > namespace.end) {
                        namespace.parent = result[i];
                    }
                }
                result.push(namespace);
            }
        }
        return result;
    }
}
exports.default = NamespaceDetails;
//# sourceMappingURL=NamespaceDetails.js.map