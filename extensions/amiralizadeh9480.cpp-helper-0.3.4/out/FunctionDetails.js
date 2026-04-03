"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("./Helpers");
class FunctionDetails {
    constructor() {
        this.name = "";
        this.before = "";
        this.after = "";
        this.template = "";
        this.arguments = "";
        this.class = null;
        this.namespace = null;
        this.start = -1;
        this.end = -1;
        this.castOperator = false;
        this.previouses = [];
    }
    /**
     * Get Implementation code
     *
     * @param snippet
     * @param includeBody
     * @returns string
     */
    generteImplementation(snippet = false, includeBody = true) {
        var _a;
        let out = "";
        let before = this.before;
        let isMemberFunction = this.before.indexOf('friend') === -1;
        before = before.replace(/(virtual|static|explicit|friend)\s*/, '');
        let after = this.after;
        after = after.replace(/(override|final)\s*/g, '');
        if (this.class && isMemberFunction && this.class.getTemplateParametersNested().length > 0) {
            out += 'template<' + Helpers_1.default.removeArgumentDefault((_a = this.class) === null || _a === void 0 ? void 0 : _a.getTemplateParametersNested().join(', ')) + '>\n';
        }
        if (this.template.length > 0) {
            out += 'template<' + Helpers_1.default.removeArgumentDefault(this.getTemplateParameters()) + '>\n';
        }
        if (this.castOperator === false) {
            out += before + (before.length > 0 ? ' ' : '');
        }
        if (this.class && isMemberFunction) {
            out += this.class.getNestedName() + '::';
            if (this.castOperator) {
                out += this.before + ' ';
            }
        }
        out += this.name + '(' + Helpers_1.default.removeArgumentDefault(this.arguments) + ')' + (typeof after === 'string' && after.length > 0 ? ' ' + after : '');
        if (includeBody) {
            out += '\n{\n' + (snippet ? Helpers_1.default.spacer() + '${0}' : '') + '\n}';
        }
        return out;
    }
    /**
     * Template parameter names only.
     */
    getTemplateNames() {
        return Helpers_1.default.templateNames(this.template).join(', ');
    }
    /**
     * Template parameters including parameter type.
     */
    getTemplateParameters() {
        return Helpers_1.default.templateParameters(this.template).join(', ');
    }
    /**
     * Get namespace of function.
     */
    getNamespace() {
        if (this.class) {
            return this.class.namespace;
        }
        return this.namespace;
    }
    /**
     * Parse functions
     *
     * @param source
     */
    static parseFunctions(source) {
        let result = [];
        let templateRegex = Helpers_1.default.templateRegex;
        let attributeRegex = "(\\[\\[[^\\]]+\\]\\])*";
        let returnTypeRegex = "((?!template\\b)\\b(([\\w_][\\w\\d<>_\\[\\]\\.:\,]*\\s+)*[\\w_][\\w\\d<>_\\[\\]\\(\\)\\.:\,]*)(\\**\\&{0,2}))?";
        let funcRegex = "((\\**\\&{0,2})((operator\\s*([+-=*\\/%!<>&|~\\[\\]^&\\.\\,]\\s*|\\(\\))+)|(~?[\\w_][\\w\\d_]*)))";
        let funcParamsRegex = "\\(((?:[^)(]*(\\((?:[^)(]*?)*\\))?)+)\\)";
        let afterParamsRegex = "([^;\\)]*)\\;";
        source = source.replace(/\/\/[^\r\n]+/g, ss => '#'.repeat(ss ? ss.length : 1));
        source = source.replace(/\/\*\*[\s\S]+(?=\*\/)\*\//g, ss => ss.replace(/[^\r\n]+/g, sss => '#'.repeat(sss ? sss.length : 1) + '\n'));
        // Strip Unreal Engine specifiers so they don't break parsing and crash VSCode
        source = source.replace(/(UCLASS|UPROPERTY|UFUNCTION|UINTERFACE|UENUM|USTRUCT)[^\r\n]+/g, ss => '#'.repeat(ss ? ss.length : 1));
        let funcRegexStr = templateRegex + attributeRegex + '\\s+' + returnTypeRegex + '\\s+' + funcRegex + '\\s*' + funcParamsRegex + '\\s*' + afterParamsRegex;
        let regex = new RegExp(funcRegexStr, 'gm');
        let match = null, match2 = null;
        while (match = regex.exec(source)) {
            let funcDetails = new FunctionDetails;
            funcDetails.template = match[2] ? match[2] : "";
            funcDetails.name = match[11];
            funcDetails.arguments = match[15] ? match[15] : "";
            funcDetails.before = ((match[6] ? match[6].trim() : "") + (match[8] ? match[8].trim() : "") + (match[10] ? match[10].trim() : "")).replace(/(public|private|protected)\s*:\s*/, '');
            funcDetails.after = match[17] ? match[17] : "";
            funcDetails.start = match.index;
            funcDetails.end = match.index + match[0].length;
            if (funcDetails.before === 'operator') {
                funcDetails.castOperator = true;
            }
            result.push(funcDetails);
        }
        return result;
    }
}
exports.default = FunctionDetails;
//# sourceMappingURL=FunctionDetails.js.map