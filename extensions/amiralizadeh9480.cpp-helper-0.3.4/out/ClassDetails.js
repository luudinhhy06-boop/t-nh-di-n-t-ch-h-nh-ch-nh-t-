"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("./Helpers");
class ClassDetails {
    constructor() {
        this.parent = null;
        this.namespace = null;
        this.template = "";
        this.templateSpecialization = "";
        this.name = "";
        this.start = -1;
        this.end = -1;
    }
    /**
     * Get root parent class in nested classes.
     *
     * If has no parent then returns it self.
     *
     * @example class A { class B {} }
     * root class of B is A
     * root class of A is A
     */
    getRootClass() {
        if (this.parent) {
            return this.parent.getRootClass();
        }
        return this;
    }
    /**
     * Get nested class name.
     *
     * @example class A { class B {} }  --->  nested name of A : A::B
     */
    getNestedName() {
        if (this.parent) {
            return this.parent.getNestedName() + '::' + this.name + (this.template.length > 0 ? ('<' + this.getTemplateNames() + '>') : '');
        }
        return this.name + (this.template.length > 0 ? ('<' + this.getTemplateNames() + '>') : '');
    }
    /**
     * Get template paramters including parent classes template.
     */
    getTemplateParametersNested() {
        if (this.parent) {
            return this.parent.getTemplateParametersNested().concat(Helpers_1.default.templateParameters(this.template));
        }
        return Helpers_1.default.templateParameters(this.template);
    }
    /**
     * Get template parameter names only.
     */
    getTemplateNames() {
        if (this.templateSpecialization.length > 0) {
            return Helpers_1.default.templateNames(this.templateSpecialization).join(', ');
        }
        return Helpers_1.default.templateNames(this.template).join(', ');
    }
    /**
     * Get template parameters including parameter types.
     */
    getTemplateParameters() {
        return Helpers_1.default.templateParameters(this.template).join(', ');
    }
    /**
     * Parse classes/structs
     *
     * @param source
     */
    static parseClasses(source) {
        let result = [];
        let templateRegex = Helpers_1.default.templateRegex;
        let classRegex = "(class|struct)(\\s*\\[\\[[^\\]]+\\]\\])*\\s+([\\w\\d_\\(\\)]+\\s+)*([\\w_][\\w\\d_:]*)\\s*(<.*>)?\\s*(\:[^{]+)?\\s*{";
        let classContentRegex = Helpers_1.default.scopeRegex;
        let match, match2;
        let regex = new RegExp(templateRegex + classRegex, 'gm');
        while (match = regex.exec(source)) {
            let regex2 = new RegExp(classContentRegex, 'gm');
            if (match2 = regex2.exec(source.substr(match.index + match[0].length - 1))) {
                let classDetails = new ClassDetails;
                classDetails.start = match.index;
                classDetails.end = match.index + match[0].length + match2[0].length;
                if (match[7] == 'final') {
                    classDetails.name = match[6].replace(/([\w\\d_\(\)]+\s+)*([\w_][\w\d_:]*)\s*/g, '$2');
                }
                else {
                    classDetails.name = match[7];
                }
                classDetails.template = match[2] ? match[2] : '';
                classDetails.templateSpecialization = match[8] ? match[8] : '';
                for (let i in result) {
                    if (result[i].start < classDetails.start && result[i].end > classDetails.end) {
                        classDetails.parent = result[i];
                    }
                }
                result.push(classDetails);
            }
        }
        return result;
    }
}
exports.default = ClassDetails;
//# sourceMappingURL=ClassDetails.js.map