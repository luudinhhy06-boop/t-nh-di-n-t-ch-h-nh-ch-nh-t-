"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NamespaceDetails_1 = require("./NamespaceDetails");
const FunctionDetails_1 = require("./FunctionDetails");
const ClassDetails_1 = require("./ClassDetails");
/**
 * Container of parsed details.
 */
class Container {
    constructor(code) {
        this.namespaces = [];
        this.classes = [];
        this.functions = [];
        this.namespaces = NamespaceDetails_1.default.parseNamespaces(code);
        this.classes = ClassDetails_1.default.parseClasses(code);
        this.functions = FunctionDetails_1.default.parseFunctions(code);
        for (let i in this.classes) { // Set namespace of classes
            for (let j in this.namespaces) {
                if (this.classes[i].start > this.namespaces[j].start && this.classes[i].end < this.namespaces[j].end) {
                    this.classes[i].namespace = this.namespaces[j];
                }
            }
        }
        for (let i in this.functions) { // Set classes of methods
            for (let j in this.classes) {
                if (this.functions[i].start > this.classes[j].start && this.functions[i].end < this.classes[j].end) {
                    this.functions[i].class = this.classes[j];
                }
            }
            if (this.functions[i].class === null) { // Set namespace of non-member functions
                for (let j in this.namespaces) {
                    if (this.functions[i].start > this.namespaces[j].start && this.functions[i].end < this.namespaces[j].end) {
                        this.functions[i].namespace = this.namespaces[j];
                    }
                }
            }
            if (parseInt(i) > 0) {
                this.functions[i].previouses = this.functions.slice(0, parseInt(i));
            }
        }
    }
    /**
     * Get function details in specifed position.
     *
     * @param position
     */
    findFunction(position) {
        for (let i in this.functions) {
            if (position >= this.functions[i].start && position <= this.functions[i].end) {
                return this.functions[i];
            }
        }
        return null;
    }
}
exports.default = Container;
//# sourceMappingURL=Container.js.map