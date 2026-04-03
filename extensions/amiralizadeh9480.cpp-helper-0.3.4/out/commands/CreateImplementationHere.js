"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const CreateImplementation_1 = require("./CreateImplementation");
/**
 * Generate Implementation Here Command
 */
function default_1() {
    if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.selection) {
        if (vscode.window.activeTextEditor) {
            var activeEditor = vscode.window.activeTextEditor;
            var selections = activeEditor.selections;
            selections = selections.sort((a, b) => a.start.isAfter(b.start) ? 1 : -1);
            CreateImplementation_1.create(activeEditor, activeEditor.selections, activeEditor);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=CreateImplementationHere.js.map