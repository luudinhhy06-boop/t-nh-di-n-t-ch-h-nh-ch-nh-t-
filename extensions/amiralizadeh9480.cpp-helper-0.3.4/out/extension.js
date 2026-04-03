"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    showWelcomeMessage(context);
    context.subscriptions.push(vscode.commands.registerCommand('cpp-helper.create-implementation', require('./commands/CreateImplementation').default));
    context.subscriptions.push(vscode.commands.registerCommand('cpp-helper.create-implementation-here', require('./commands/CreateImplementationHere').default));
    context.subscriptions.push(vscode.commands.registerCommand('cpp-helper.copy-implementation', require('./commands/CopyImplementation').default));
    context.subscriptions.push(vscode.commands.registerCommand('cpp-helper.create-header-guard', require('./commands/CreateHeaderGuard').default));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function showWelcomeMessage(context) {
    var _a, _b;
    let previousVersion = context.globalState.get('cpp-helper-version');
    let currentVersion = (_b = (_a = vscode.extensions.getExtension('amiralizadeh9480.cpp-helper')) === null || _a === void 0 ? void 0 : _a.packageJSON) === null || _b === void 0 ? void 0 : _b.version;
    let message = null;
    let previousVersionArray = previousVersion ? previousVersion.split('.').map((s) => Number(s)) : [0, 0, 0];
    let currentVersionArray = currentVersion.split('.').map((s) => Number(s));
    if (previousVersion === undefined || previousVersion.length === 0) {
        message = "Thanks for using C++ Helper.";
    }
    else if (currentVersion !== previousVersion && ((previousVersionArray[0] === currentVersionArray[0] && previousVersionArray[1] === currentVersionArray[1] && previousVersionArray[2] < currentVersionArray[2]) ||
        (previousVersionArray[0] === currentVersionArray[0] && previousVersionArray[1] < currentVersionArray[1]) ||
        (previousVersionArray[0] < currentVersionArray[0]))) {
        message = "C++ Helper updated to " + currentVersion + ".";
    }
    if (message) {
        const showUpdateMessage = vscode.workspace.getConfiguration("CppHelper").get('showUpdateMessage');
        if (showUpdateMessage) {
            vscode.window.showInformationMessage(message, '⭐️ Star on Github', '🐞 Report Bug')
                .then(function (val) {
                if (val === '⭐️ Rate') {
                    vscode.env.openExternal(vscode.Uri.parse('https://marketplace.visualstudio.com/items?itemName=amiralizadeh9480.cpp-helper&ssr=false#review-details'));
                }
                else if (val === '🐞 Report Bug') {
                    vscode.env.openExternal(vscode.Uri.parse('https://github.com/amir9480/vscode-cpp-helper/issues'));
                }
                else if (val === '⭐️ Star on Github') {
                    vscode.env.openExternal(vscode.Uri.parse('https://github.com/amir9480/vscode-cpp-helper'));
                }
            });
        }
        context.globalState.update('cpp-helper-version', currentVersion);
    }
}
//# sourceMappingURL=extension.js.map