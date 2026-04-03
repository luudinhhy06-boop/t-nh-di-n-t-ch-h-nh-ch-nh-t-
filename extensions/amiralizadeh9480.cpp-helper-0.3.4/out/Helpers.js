"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require('fs');
const path = require('path');
class Helpers {
    /**
     * Convert template complete string to parameter names only.
     *
     * @example template<typename T1, typename T2>  --->  T1, T2
     *
     * @param template
     */
    static templateNames(template) {
        return this.templateParameters(Helpers.removeArgumentDefault(template)).map(function (templ) {
            let match;
            if (match = /^(([\w_][\w\d_]*\s+)+)([\w_][\w\d_]*)$/g.exec(templ)) {
                return match[3];
            }
            return templ;
        });
    }
    /**
     * Convert template complete string to parameter names with types only.
     *
     * @example template<typename T1, typename T2>  --->  typename T1, typename T2
     *
     * @param template
     */
    static templateParameters(template) {
        template = template.replace(/^\s*template\s*</, '');
        template = template.replace(/>$/, '');
        if (template.length === 0) {
            return [];
        }
        return template.split(',').map((templ) => templ.trim());
    }
    /**
     * Returns space based on Indeting config for active editor.
     */
    static spacer() {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.options.insertSpaces) {
            return ' '.repeat(editor.options.tabSize);
        }
        return '\t';
    }
    /**
     * Indent code.
     *
     * @param str
     * @param count
     */
    static indent(str, count = 1) {
        if (str.match(/^(\r\n|\r|\n)/g)) {
            return str.replace(/(\r\n|\r|\n)/g, '\n' + this.spacer().repeat(count)).replace(/\n\s+$/g, '\n');
        }
        return this.spacer().repeat(count) + str.replace(/(\r\n|\r|\n)/g, '\n' + this.spacer().repeat(count)).replace(/\n\s+$/g, '\n');
    }
    /**
     * Opens source file of a active header file editor.
     */
    static openSourceFile() {
        let patterns = vscode.workspace.getConfiguration("CppHelper").get('SourcePattern');
        let replacements = vscode.workspace.getConfiguration("CppHelper").get("FindReplaceStrings");
        let notFoundBehavior = vscode.workspace.getConfiguration("CppHelper").get('SourceNotFoundBehavior');
        return new Promise(function (resolve, reject) {
            var _a;
            let fileName = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.fileName;
            if (fileName) {
                let name = fileName.replace(/^.*[\\\/]/, '').replace(/\.[^\.]+$/, '');
                const directory = fileName.replace(/[\\\/][^\\\/]+$/, '');
                let extension = fileName.split('.').pop();
                for (let i in patterns) {
                    if (typeof patterns[i] === 'string') {
                        let fileToOpen = "";
                        if (patterns[i][0] === '/') {
                            fileToOpen = vscode.workspace.rootPath + patterns[i].replace('{FILE}', name);
                        }
                        else {
                            fileToOpen = path.join(directory, patterns[i].replace('{FILE}', name));
                        }
                        fileToOpen = fileToOpen.replace(/\\/g, '/');
                        replacements.forEach(pair => {
                            fileToOpen = fileToOpen.replace(new RegExp(pair.find.replace(/\\/g, '/').replace(/\//g, '\\/'), 'g'), pair.replace.replace(/\\/g, '/'));
                        });
                        if (fs.existsSync(fileToOpen)) {
                            for (let i in vscode.window.visibleTextEditors) {
                                let textEditor = vscode.window.visibleTextEditors[i];
                                if (textEditor.document.fileName == fileToOpen) {
                                    resolve(textEditor);
                                    return;
                                }
                            }
                            vscode.workspace.openTextDocument(fileToOpen)
                                .then((doc) => {
                                vscode.window.showTextDocument(doc, 1, true)
                                    .then(function (textEditor) {
                                    resolve(textEditor);
                                });
                            });
                            return;
                        }
                    }
                }
                if (notFoundBehavior === 'Create source file' && (extension === null || extension === void 0 ? void 0 : extension.toLowerCase()) !== 'cpp') {
                    let workspaceEdit = new vscode.WorkspaceEdit;
                    let newdirectory = directory.replace(/\\/g, '/');
                    replacements.forEach(pair => {
                        newdirectory = newdirectory.replace(new RegExp(pair.find.replace(/\\/g, '/').replace(/\//g, '\\/'), 'g'), pair.replace.replace(/\\/g, '/'));
                    });
                    workspaceEdit.createFile(vscode.Uri.file(newdirectory + '/' + name + '.cpp'), { overwrite: false, ignoreIfExists: true });
                    return vscode.workspace.applyEdit(workspaceEdit)
                        .then(function (result) {
                        if (result) {
                            return vscode.workspace.openTextDocument(newdirectory + '/' + name + '.cpp')
                                .then((doc) => {
                                vscode.window.showTextDocument(doc, 1, true)
                                    .then(function (textEditor) {
                                    textEditor.insertSnippet(new vscode.SnippetString("#include \"" + name + "." + extension + "\"\n"))
                                        .then(function () {
                                        resolve(textEditor);
                                    });
                                });
                            });
                        }
                        if (vscode.window.activeTextEditor) {
                            resolve(vscode.window.activeTextEditor);
                        }
                    });
                }
                else if (notFoundBehavior === "Implement in same file" && vscode.window.activeTextEditor) {
                    resolve(vscode.window.activeTextEditor);
                }
                reject("Could not find or create matching source file");
            }
        });
    }
    /**
     * Create recursive regex with limited depth.
     *
     * @param regex
     * @param depth
     */
    static recursiveRegex(regex, depth = 8) {
        let result = regex;
        for (let i = 0; i < depth; i++) {
            result = result.replace("?R", regex);
        }
        result = result.replace("|(?R)", "");
        return result;
    }
    /**
     * Remove default value from arguments.
     *
     * @param args
     */
    static removeArgumentDefault(args) {
        return args.replace(/([^=^,]+)(\s+=\s*[^\,^>]*)/g, '$1').replace(/([^=^,]+)(=\s*[^\,]*)/g, '$1').trim();
    }
}
exports.default = Helpers;
Helpers.scopeRegex = Helpers.recursiveRegex("(\\s*\\{)([^\\{\\}]|(?R))*\\}");
Helpers.templateRegex = "((template\\s*<([\\w\\d_\\,\\s\\.\\=]*)>)[\\s\\r\\n]*)?";
//# sourceMappingURL=Helpers.js.map