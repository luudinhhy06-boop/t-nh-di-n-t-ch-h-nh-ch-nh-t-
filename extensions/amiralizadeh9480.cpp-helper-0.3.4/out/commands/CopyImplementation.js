"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Container_1 = require("../Container");
/**
 * Copy to clipboard implementation command
 */
function default_1() {
    if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.selection) {
        if (vscode.window.activeTextEditor) {
            var activeEditor = vscode.window.activeTextEditor;
            var selections = activeEditor.selections;
            let imp = "";
            let selection;
            while (selection = selections.shift()) {
                let code = activeEditor.document.getText();
                let container = new Container_1.default(code);
                let funcDetails = container.findFunction(activeEditor.document.offsetAt(selection.start));
                if (funcDetails) { // If was null then selection is not a c++ function declration
                    imp += '\n' + (funcDetails === null || funcDetails === void 0 ? void 0 : funcDetails.generteImplementation(false)) + '\n';
                }
            }
            if (imp.length > 0) {
                vscode.env.clipboard.writeText(imp);
            }
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=CopyImplementation.js.map